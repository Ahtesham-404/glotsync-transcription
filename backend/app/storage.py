"""Amazon S3 storage operations.

All S3 calls use run_in_executor to avoid blocking the async event loop.
"""
import asyncio
from datetime import datetime, timedelta, timezone
from functools import partial
from typing import Optional

import boto3
import structlog
from botocore.exceptions import ClientError

from app.config import get_settings

log = structlog.get_logger(__name__)
settings = get_settings()

_s3_client = None


def get_s3_client():
    """Get or create a boto3 S3 client (lazy singleton, thread-safe for reads)."""
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id or None,
            aws_secret_access_key=settings.aws_secret_access_key or None,
        )
    return _s3_client


def build_s3_key(user_id: str, file_id: str, filename: str, prefix: str = "uploads") -> str:
    """Generate an S3 object key."""
    return f"{prefix}/{user_id}/{file_id}/{filename}"


def _sync_upload(s3_key: str, file_data: bytes, content_type: str) -> None:
    """Synchronous S3 upload — runs in thread executor."""
    s3 = get_s3_client()
    s3.put_object(
        Bucket=settings.s3_bucket_name,
        Key=s3_key,
        Body=file_data,
        ContentType=content_type,
        ServerSideEncryption="AES256",
    )


def _sync_delete(s3_key: str) -> None:
    """Synchronous S3 delete — runs in thread executor."""
    s3 = get_s3_client()
    s3.delete_object(Bucket=settings.s3_bucket_name, Key=s3_key)


async def upload_to_s3(
    file_data: bytes,
    s3_key: str,
    content_type: str,
) -> str:
    """Upload bytes to S3 without blocking the event loop. Returns the S3 key."""
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, partial(_sync_upload, s3_key, file_data, content_type))
        log.info("s3_upload_success", key=s3_key, size=len(file_data))
        return s3_key
    except ClientError as exc:
        log.error("s3_upload_failed", key=s3_key, error=str(exc))
        raise


async def upload_text_to_s3(text: str, s3_key: str, content_type: str = "text/plain") -> str:
    """Upload a text string to S3. Used for transcript exports."""
    return await upload_to_s3(text.encode("utf-8"), s3_key, content_type)


async def delete_from_s3(s3_key: str) -> None:
    """Delete an S3 object without blocking the event loop."""
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, partial(_sync_delete, s3_key))
        log.info("s3_delete_success", key=s3_key)
    except ClientError as exc:
        log.warning("s3_delete_failed", key=s3_key, error=str(exc))


def generate_presigned_url(
    s3_key: str,
    expiry_seconds: Optional[int] = None,
    content_disposition: Optional[str] = None,
) -> tuple[str, datetime]:
    """
    Generate a presigned GET URL for an S3 object.
    This is synchronous but fast (no network call, just HMAC signing).
    Returns (url, expires_at).
    """
    expiry = expiry_seconds or settings.s3_signed_url_expiry
    params: dict = {
        "Bucket": settings.s3_bucket_name,
        "Key": s3_key,
    }
    if content_disposition:
        params["ResponseContentDisposition"] = content_disposition

    s3 = get_s3_client()
    url = s3.generate_presigned_url("get_object", Params=params, ExpiresIn=expiry)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expiry)
    return url, expires_at


def check_s3_connectivity() -> bool:
    """Verify S3 bucket is accessible. Used for health checks."""
    try:
        s3 = get_s3_client()
        s3.head_bucket(Bucket=settings.s3_bucket_name)
        return True
    except Exception:
        return False
