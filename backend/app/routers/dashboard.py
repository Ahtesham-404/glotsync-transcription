"""Dashboard statistics endpoint."""
from datetime import datetime, timedelta, timezone

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.config import get_settings
from app.database import get_db
from app.models import AuditLog, File as FileModel, Job, User
from app.schemas import ActivityItem, DashboardStats, UsageDataPoint

log = structlog.get_logger(__name__)
router = APIRouter()

PLAN_STORAGE_QUOTA = {
    "free": 500 * 1024 * 1024,           # 500 MB
    "starter": 5 * 1024 * 1024 * 1024,   # 5 GB
    "pro": 25 * 1024 * 1024 * 1024,      # 25 GB
    "enterprise": None,                    # unlimited
}


@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DashboardStats:
    """Return dashboard statistics for the authenticated user."""

    # Job counts by status
    jobs_result = await db.execute(
        select(Job.status, func.count(Job.id))
        .join(FileModel, Job.file_id == FileModel.id)
        .where(FileModel.user_id == current_user.id, FileModel.is_deleted == False)  # noqa: E712
        .group_by(Job.status)
    )
    job_counts = {row[0]: row[1] for row in jobs_result.all()}

    # Recent audit log activity — simple query without the broken join
    activity_result = await db.execute(
        select(AuditLog)
        .where(AuditLog.user_id == current_user.id)
        .order_by(AuditLog.created_at.desc())
        .limit(10)
    )
    activities = []
    for audit in activity_result.scalars().all():
        activities.append(ActivityItem(
            id=str(audit.id),
            type=audit.action.replace("file_", ""),
            filename=audit.resource_id or "Unknown file",
            timestamp=audit.created_at,
        ))

    # Usage by day (last 7 days)
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    usage_result = await db.execute(
        select(
            func.date(FileModel.created_at).label("date"),
            func.count(FileModel.id).label("uploads"),
        )
        .where(
            FileModel.user_id == current_user.id,
            FileModel.created_at >= seven_days_ago,
            FileModel.is_deleted == False,  # noqa: E712
        )
        .group_by(func.date(FileModel.created_at))
        .order_by(func.date(FileModel.created_at))
    )
    usage_by_day = [
        UsageDataPoint(date=str(row.date), uploads=row.uploads, completed=0)
        for row in usage_result.all()
    ]

    quota = PLAN_STORAGE_QUOTA.get(current_user.plan)
    if quota is None:
        quota = 1_000_000_000_000  # 1 TB placeholder for unlimited

    return DashboardStats(
        total_uploads=current_user.total_uploads,
        completed_jobs=job_counts.get("completed", 0),
        processing_jobs=job_counts.get("processing", 0) + job_counts.get("queued", 0),
        failed_jobs=job_counts.get("failed", 0),
        storage_used_bytes=current_user.storage_used_bytes,
        storage_quota_bytes=quota,
        recent_activity=activities,
        usage_by_day=usage_by_day,
    )
