"""GET /api/files, GET /api/files/{id}, DELETE /api/files/{id}"""
import uuid

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth import get_current_user
from app.database import get_db
from app.models import AuditLog, File as FileModel, Job, User
from app.schemas import DeleteResponse, FileOut, PaginatedResponse
from app.storage import delete_from_s3

log = structlog.get_logger(__name__)
router = APIRouter()


@router.get("/files", response_model=PaginatedResponse[FileOut])
async def list_files(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[FileOut]:
    """List all files for the authenticated user, paginated."""
    offset = (page - 1) * page_size

    # Count total
    count_result = await db.execute(
        select(func.count(FileModel.id))
        .where(FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
    )
    total = count_result.scalar_one()

    # Fetch page
    result = await db.execute(
        select(FileModel)
        .where(FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
        .options(selectinload(FileModel.job))
        .order_by(FileModel.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    files = result.scalars().all()

    total_pages = max(1, -(-total // page_size))  # ceiling division

    return PaginatedResponse(
        items=[FileOut.model_validate(f) for f in files],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/files/{file_id}", response_model=FileOut)
async def get_file(
    file_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FileOut:
    """Get a single file by ID (must belong to the current user)."""
    result = await db.execute(
        select(FileModel)
        .where(FileModel.id == file_id, FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
        .options(selectinload(FileModel.job))
    )
    file = result.scalar_one_or_none()
    if not file:
        raise HTTPException(status_code=404, detail="File not found.")
    return FileOut.model_validate(file)


@router.delete("/files/{file_id}", response_model=DeleteResponse)
async def delete_file(
    file_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DeleteResponse:
    """Delete a file (soft-delete DB record, remove from S3)."""
    result = await db.execute(
        select(FileModel)
        .where(FileModel.id == file_id, FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
        .options(selectinload(FileModel.job))
    )
    file = result.scalar_one_or_none()
    if not file:
        raise HTTPException(status_code=404, detail="File not found.")

    # Remove from S3
    await delete_from_s3(file.s3_key)

    # Soft-delete
    file.is_deleted = True
    current_user.storage_used_bytes = max(0, current_user.storage_used_bytes - file.size_bytes)

    # Audit log
    log_entry = AuditLog(
        user_id=current_user.id,
        action="file_delete",
        resource_type="file",
        resource_id=str(file_id),
    )
    db.add(log_entry)
    await db.flush()

    log.info("file_deleted", file_id=str(file_id), user_id=str(current_user.id))
    return DeleteResponse()


@router.get("/jobs/{job_id}", response_model=dict)
async def get_job_status(
    job_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Poll job status for a given job ID."""
    result = await db.execute(
        select(Job)
        .join(FileModel, Job.file_id == FileModel.id)
        .where(Job.id == job_id, FileModel.user_id == current_user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    return {
        "id": str(job.id),
        "file_id": str(job.file_id),
        "status": job.status,
        "progress": job.progress,
        "error_message": job.error_message,
        "transcript_id": str(job.transcript_id) if job.transcript_id else None,
        "duration_seconds": job.duration_seconds,
        "word_count": job.word_count,
        "language": job.language,
        "created_at": job.created_at.isoformat(),
        "updated_at": job.updated_at.isoformat(),
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
    }
