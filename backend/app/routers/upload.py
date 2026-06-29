"""POST /api/upload — file upload and transcription job creation."""
import mimetypes
import re
import unicodedata
import uuid

import structlog
from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.config import get_settings
from app.database import get_db, AsyncSessionLocal
from app.models import File as FileModel, Job, Transcript, User
from app.schemas import UploadResponse
from app.storage import build_s3_key, upload_to_s3, upload_text_to_s3
from app.transcription import transcription_service, format_srt, format_vtt

log = structlog.get_logger(__name__)
settings = get_settings()
router = APIRouter()

SUPPORTED_MIME_TYPES = {
    "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav",
    "audio/aac", "audio/m4a", "audio/x-m4a", "audio/flac", "audio/ogg",
    "audio/mp4", "video/mp4", "video/quicktime", "video/x-msvideo",
    "video/x-matroska", "video/webm", "video/mpeg",
}

SUPPORTED_EXTENSIONS = {
    "mp3", "wav", "aac", "m4a", "flac", "ogg",
    "mp4", "mov", "avi", "mkv", "webm",
}


def sanitize_filename(name: str) -> str:
    """Remove/replace unsafe characters from a filename."""
    name = unicodedata.normalize("NFKD", name)
    name = re.sub(r"[^\w.\-]", "_", name)
    name = re.sub(r"_{2,}", "_", name)
    return name[:200]


def validate_mime(filename: str, content_type: str) -> None:
    """Raise 422 if the file type is not supported."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    mime_ok = content_type.lower() in SUPPORTED_MIME_TYPES
    ext_ok = ext in SUPPORTED_EXTENSIONS
    if not mime_ok and not ext_ok:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported file type '{content_type}' (.{ext}). "
                   "Supported: MP3, WAV, AAC, M4A, FLAC, OGG, MP4, MOV, AVI, MKV, WEBM.",
        )


async def _run_transcription(
    job_id: uuid.UUID,
    file_id: uuid.UUID,
    s3_key: str,
    original_name: str,
    file_data: bytes,
    user_id: uuid.UUID,
) -> None:
    """
    Background task: transcribe a file and store results.
    Runs after the HTTP response has been sent to the client.
    """
    import json
    from datetime import datetime, timezone
    from sqlalchemy import select

    log.info("transcription_starting", job_id=str(job_id))

    async with AsyncSessionLocal() as db:
        try:
            # Mark job as processing
            result = await db.execute(select(Job).where(Job.id == job_id))
            job = result.scalar_one_or_none()
            if not job:
                log.error("transcription_job_not_found", job_id=str(job_id))
                return

            job.status = "processing"
            job.progress = 10
            await db.commit()

            # Run transcription
            try:
                transcript_result = await transcription_service.transcribe(
                    file_data,
                    original_name,
                    s3_key=s3_key,
                )
            except Exception as exc:
                log.error("transcription_failed", job_id=str(job_id), error=str(exc))
                job.status = "failed"
                job.error_message = str(exc)
                await db.commit()
                return

            job.progress = 80
            await db.commit()

            # Generate and upload transcript formats
            user_id_str = str(user_id)
            file_id_str = str(file_id)
            base_key = f"transcripts/{user_id_str}/{file_id_str}"

            txt_content = transcript_result.text
            srt_content = format_srt(transcript_result.segments)
            vtt_content = format_vtt(transcript_result.segments)

            txt_key = f"{base_key}/transcript.txt"
            srt_key = f"{base_key}/transcript.srt"
            vtt_key = f"{base_key}/transcript.vtt"

            await upload_text_to_s3(txt_content, txt_key, "text/plain")
            await upload_text_to_s3(srt_content, srt_key, "text/srt")
            await upload_text_to_s3(vtt_content, vtt_key, "text/vtt")

            # Create transcript record
            transcript_id = uuid.uuid4()
            db_transcript = Transcript(
                id=transcript_id,
                job_id=job_id,
                file_id=file_id,
                text=transcript_result.text,
                segments_json=json.dumps(transcript_result.segments),
                language=transcript_result.language,
                duration_seconds=transcript_result.duration_seconds,
                word_count=transcript_result.word_count,
                s3_txt_key=txt_key,
                s3_srt_key=srt_key,
                s3_vtt_key=vtt_key,
            )
            db.add(db_transcript)

            # Update job
            job.status = "completed"
            job.progress = 100
            job.transcript_id = transcript_id
            job.duration_seconds = transcript_result.duration_seconds
            job.word_count = transcript_result.word_count
            job.language = transcript_result.language
            job.completed_at = datetime.now(timezone.utc)

            # Update user stats
            user_result = await db.execute(
                select(User).where(User.id == user_id)  # type: ignore[arg-type]
            )
            user = user_result.scalar_one_or_none()
            if user:
                user.completed_jobs += 1

            await db.commit()
            log.info("transcription_complete", job_id=str(job_id), transcript_id=str(transcript_id))

        except Exception as exc:
            log.error("transcription_background_error", job_id=str(job_id), error=str(exc))
            await db.rollback()
            try:
                result = await db.execute(select(Job).where(Job.id == job_id))
                job = result.scalar_one_or_none()
                if job:
                    job.status = "failed"
                    job.error_message = "Internal processing error"
                    await db.commit()
            except Exception:
                pass


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Audio or video file"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UploadResponse:
    """
    Upload an audio or video file and create a transcription job.

    - Validates file type and size
    - Stores file in Amazon S3
    - Creates File and Job database records
    - Dispatches transcription as a background task
    - Returns fileId and jobId for polling
    """
    original_name = file.filename or "upload"
    content_type = file.content_type or mimetypes.guess_type(original_name)[0] or "application/octet-stream"

    validate_mime(original_name, content_type)

    content = await file.read()
    file_size = len(content)

    if file_size == 0:
        raise HTTPException(status_code=422, detail="File is empty.")

    if file_size > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {settings.max_file_size_mb} MB.",
        )

    file_id = uuid.uuid4()
    sanitized = sanitize_filename(original_name)
    s3_key = build_s3_key(str(current_user.id), str(file_id), sanitized, prefix="uploads")

    # Upload to S3
    try:
        await upload_to_s3(content, s3_key, content_type)
    except Exception as exc:
        log.error("upload_s3_failed", user_id=str(current_user.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to store file. Please try again.")

    # Persist file record
    db_file = FileModel(
        id=file_id,
        user_id=current_user.id,
        original_name=original_name,
        filename=sanitized,
        mime_type=content_type,
        size_bytes=file_size,
        s3_key=s3_key,
    )
    db.add(db_file)

    # Create job record
    job_id = uuid.uuid4()
    db_job = Job(
        id=job_id,
        file_id=file_id,
        status="queued",
        progress=0,
    )
    db.add(db_job)

    # Update user stats
    current_user.total_uploads += 1
    current_user.storage_used_bytes += file_size

    # Commit now so the File and Job rows are durably persisted BEFORE the
    # background task starts. The task uses its own DB session and would
    # otherwise race the request's deferred commit and fail to find the job.
    await db.commit()

    # Dispatch transcription as a background task
    # The file bytes are passed directly to avoid re-fetching from S3
    background_tasks.add_task(
        _run_transcription,
        job_id=job_id,
        file_id=file_id,
        s3_key=s3_key,
        original_name=original_name,
        file_data=content,
        user_id=current_user.id,
    )

    log.info(
        "file_uploaded",
        file_id=str(file_id),
        job_id=str(job_id),
        user_id=str(current_user.id),
        size=file_size,
        mime=content_type,
    )

    return UploadResponse(file_id=file_id, job_id=job_id)
