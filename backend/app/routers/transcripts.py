"""GET /api/transcript/{id}, GET /api/download/{id}"""
import json
import uuid

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import File as FileModel, Job, Transcript, User
from app.schemas import DownloadResponse, TranscriptOut
from app.storage import generate_presigned_url
from app.transcription import format_srt, format_vtt

log = structlog.get_logger(__name__)
router = APIRouter()


@router.get("/transcript/{transcript_id}", response_model=TranscriptOut)
async def get_transcript(
    transcript_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TranscriptOut:
    """Retrieve the full transcript for a completed job."""
    result = await db.execute(
        select(Transcript)
        .join(FileModel, Transcript.file_id == FileModel.id)
        .where(Transcript.id == transcript_id, FileModel.user_id == current_user.id)
    )
    transcript = result.scalar_one_or_none()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not found.")

    segments = json.loads(transcript.segments_json or "[]")

    return TranscriptOut(
        id=transcript.id,
        job_id=transcript.job_id,
        file_id=transcript.file_id,
        text=transcript.text,
        segments=segments,
        language=transcript.language,
        duration_seconds=transcript.duration_seconds,
        word_count=transcript.word_count,
        created_at=transcript.created_at,
    )


@router.get("/download/{file_id}", response_model=DownloadResponse)
async def get_download_url(
    file_id: uuid.UUID,
    format: str = Query(default="txt", pattern="^(txt|srt|vtt|original)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DownloadResponse:
    """
    Generate a presigned S3 download URL for a transcript or original file.

    format: txt | srt | vtt | original
    """
    # Fetch file and verify ownership
    file_result = await db.execute(
        select(FileModel)
        .where(FileModel.id == file_id, FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
    )
    file = file_result.scalar_one_or_none()
    if not file:
        raise HTTPException(status_code=404, detail="File not found.")

    if format == "original":
        url, expires_at = generate_presigned_url(
            file.s3_key,
            content_disposition=f'attachment; filename="{file.original_name}"',
        )
        return DownloadResponse(download_url=url, expires_at=expires_at)

    # Fetch transcript
    job_result = await db.execute(
        select(Job).where(Job.file_id == file_id)
    )
    job = job_result.scalar_one_or_none()
    if not job or job.status != "completed" or not job.transcript_id:
        raise HTTPException(status_code=404, detail="Transcript not available yet.")

    transcript_result = await db.execute(
        select(Transcript).where(Transcript.id == job.transcript_id)
    )
    transcript = transcript_result.scalar_one_or_none()
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript record not found.")

    # Select the right S3 key
    if format == "txt":
        s3_key = transcript.s3_txt_key
    elif format == "srt":
        s3_key = transcript.s3_srt_key
    else:  # vtt
        s3_key = transcript.s3_vtt_key

    if not s3_key:
        raise HTTPException(
            status_code=404,
            detail=f"{format.upper()} format is not yet generated for this transcript.",
        )

    ext = format
    url, expires_at = generate_presigned_url(
        s3_key,
        content_disposition=f'attachment; filename="transcript.{ext}"',
    )
    return DownloadResponse(download_url=url, expires_at=expires_at)
