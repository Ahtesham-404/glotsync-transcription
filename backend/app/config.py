"""Application configuration loaded from environment variables.

Requires Python 3.13+. All settings are loaded from environment variables
or a .env file — never hardcoded.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_env: str = "development"
    app_debug: bool = False
    app_secret_key: str = "insecure-dev-secret"
    allowed_origins: str = "http://localhost:5173"

    # Database
    database_url: str = "postgresql+asyncpg://glotsync:glotsync@localhost:5432/glotsync"

    # AWS — shared credentials for S3 and Amazon Transcribe
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"

    # Amazon S3
    s3_bucket_name: str = "glotsync-files"
    s3_signed_url_expiry: int = 900  # seconds

    # Amazon Transcribe
    # Language code used when starting a transcription job.
    # Use "en-US" for US English. For automatic language detection set to "auto"
    # and enable IdentifyLanguage in the Transcribe job settings (requires changes
    # in transcription.py if you want that feature).
    # Full list: https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html
    transcribe_language_code: str = "en-US"

    # Firebase
    firebase_project_id: str = "glotsync-199c1"
    firebase_service_account_path: str = ""

    # Upload
    max_file_size_mb: int = 500

    # Rate limiting
    rate_limit_per_minute: int = 60
    rate_limit_upload_per_hour: int = 20

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
