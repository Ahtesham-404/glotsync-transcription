"""Pydantic request/response schemas."""
import uuid
from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


# ── Generic ─────────────────────────────────────────────────────────────────

class ApiResponse(BaseModel, Generic[T]):
    data: T
    message: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Auth / User ──────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    uid: str
    email: Optional[str]
    display_name: Optional[str]
    photo_url: Optional[str]
    email_verified: bool
    plan: str
    storage_used_bytes: int
    total_uploads: int
    completed_jobs: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── File ────────────────────────────────────────────────────────────────────

class JobOut(BaseModel):
    id: uuid.UUID
    file_id: uuid.UUID
    status: str
    progress: int
    error_message: Optional[str] = None
    transcript_id: Optional[uuid.UUID] = None
    duration_seconds: Optional[float] = None
    word_count: Optional[int] = None
    language: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class FileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    original_name: str
    filename: str
    mime_type: str
    size_bytes: int
    s3_key: str
    created_at: datetime
    updated_at: datetime
    job: Optional[JobOut] = None

    model_config = {"from_attributes": True}


class UploadResponse(BaseModel):
    file_id: uuid.UUID
    job_id: uuid.UUID
    message: str = "File uploaded and queued for transcription"


class DeleteResponse(BaseModel):
    message: str = "File deleted successfully"


# ── Transcript ───────────────────────────────────────────────────────────────

class TranscriptWord(BaseModel):
    word: str
    start: float
    end: float
    confidence: float = 1.0


class TranscriptSegment(BaseModel):
    id: int
    start: float
    end: float
    text: str
    words: Optional[List[TranscriptWord]] = None


class TranscriptOut(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    file_id: uuid.UUID
    text: str
    segments: List[TranscriptSegment]
    language: str
    duration_seconds: float
    word_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Download ─────────────────────────────────────────────────────────────────

class DownloadResponse(BaseModel):
    download_url: str
    expires_at: datetime


# ── Dashboard ────────────────────────────────────────────────────────────────

class ActivityItem(BaseModel):
    id: str
    type: str
    filename: str
    timestamp: datetime
    metadata: Optional[dict[str, Any]] = None


class UsageDataPoint(BaseModel):
    date: str
    uploads: int
    completed: int


class DashboardStats(BaseModel):
    total_uploads: int
    completed_jobs: int
    processing_jobs: int
    failed_jobs: int
    storage_used_bytes: int
    storage_quota_bytes: int
    recent_activity: List[ActivityItem]
    usage_by_day: List[UsageDataPoint]


# ── Health ───────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    database: str
    storage: str
