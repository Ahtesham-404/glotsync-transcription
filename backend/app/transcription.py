"""
Transcription service — Amazon Transcribe.

Flow:
  1. File is already in S3 after upload (s3://bucket/uploads/{user}/{file}/{name})
  2. Start an Amazon Transcribe job pointing at the S3 URI
  3. Poll until the job completes (status: COMPLETED | FAILED)
  4. Fetch the JSON transcript from the output S3 URI
  5. Parse results into TranscriptionResult with segments + timestamps

AWS permissions required on the IAM user/role:
  - transcribe:StartTranscriptionJob
  - transcribe:GetTranscriptionJob
  - s3:GetObject  (on the input bucket)
  - s3:PutObject  (on the output bucket — same bucket is fine)
"""
import asyncio
import json
import time
import uuid
from functools import partial
from typing import Any

import boto3
import structlog

from app.config import get_settings
from app.storage import download_from_s3

log = structlog.get_logger(__name__)
settings = get_settings()


class TranscriptionResult:
    """Normalized transcription output — provider-agnostic."""

    def __init__(
        self,
        text: str,
        segments: list[dict[str, Any]],
        language: str,
        duration_seconds: float,
    ):
        self.text = text
        self.segments = segments
        self.language = language
        self.duration_seconds = duration_seconds

    @property
    def word_count(self) -> int:
        return len(self.text.split())


# ─── Amazon Transcribe client (lazy singleton) ───────────────────────────────

_transcribe_client = None


def _get_transcribe_client():
    global _transcribe_client
    if _transcribe_client is None:
        _transcribe_client = boto3.client(
            "transcribe",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id or None,
            aws_secret_access_key=settings.aws_secret_access_key or None,
        )
    return _transcribe_client


# ─── Supported media formats for Amazon Transcribe ───────────────────────────
# https://docs.aws.amazon.com/transcribe/latest/dg/how-input.html#how-input-audio

TRANSCRIBE_FORMAT_MAP = {
    "mp3": "mp3", "wav": "wav", "flac": "flac", "ogg": "ogg",
    "mp4": "mp4", "m4a": "mp4", "aac": "mp4", "webm": "webm",
    "mov": "mp4", "avi": "mp4", "mkv": "mp4",
}


def _get_media_format(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return TRANSCRIBE_FORMAT_MAP.get(ext, "mp4")


# ─── Synchronous helpers (run in executor to avoid blocking the event loop) ──

def _start_job(job_name: str, s3_uri: str, media_format: str, language_code: str) -> dict:
    """Start an Amazon Transcribe job. Runs in a thread executor."""
    client = _get_transcribe_client()
    return client.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={"MediaFileUri": s3_uri},
        MediaFormat=media_format,
        LanguageCode=language_code,
        OutputBucketName=settings.s3_bucket_name,
        OutputKey=f"transcribe-output/{job_name}.json",
        Settings={
            "ShowSpeakerLabels": False,
            "ShowAlternatives": False,
        },
    )


def _get_job(job_name: str) -> dict:
    """Get the status of a Transcribe job. Runs in a thread executor."""
    client = _get_transcribe_client()
    return client.get_transcription_job(TranscriptionJobName=job_name)


# ─── Result parser ────────────────────────────────────────────────────────────

def _parse_transcribe_result(result_json: dict) -> tuple[str, list[dict[str, Any]], float]:
    """
    Parse Amazon Transcribe JSON output into (text, segments, duration_seconds).

    The Transcribe output format:
    {
      "results": {
        "transcripts": [{"transcript": "full text..."}],
        "items": [
          {"type": "pronunciation", "start_time": "0.0", "end_time": "0.5",
           "alternatives": [{"content": "word", "confidence": "0.99"}]},
          {"type": "punctuation", "alternatives": [{"content": "."}]},
          ...
        ]
      }
    }
    """
    results = result_json.get("results", {})
    transcripts = results.get("transcripts", [])
    full_text = transcripts[0].get("transcript", "") if transcripts else ""

    items = results.get("items", [])

    # Build word-level data from items
    words: list[dict[str, Any]] = []
    for item in items:
        if item.get("type") != "pronunciation":
            continue
        alternatives = item.get("alternatives", [])
        if not alternatives:
            continue
        best = alternatives[0]
        words.append({
            "word": best.get("content", ""),
            "start": float(item.get("start_time", 0)),
            "end": float(item.get("end_time", 0)),
            "confidence": float(best.get("confidence", 1.0)),
        })

    # Group words into ~10-second segments for the transcript viewer
    segments: list[dict[str, Any]] = []
    if words:
        seg_words: list[dict[str, Any]] = []
        seg_start = words[0]["start"]
        seg_id = 0

        for word in words:
            seg_words.append(word)
            elapsed = word["end"] - seg_start
            if elapsed >= 10.0:
                segments.append({
                    "id": seg_id,
                    "start": seg_start,
                    "end": word["end"],
                    "text": " ".join(w["word"] for w in seg_words),
                })
                seg_id += 1
                seg_words = []
                seg_start = word["end"]

        # Flush any remaining words
        if seg_words:
            segments.append({
                "id": seg_id,
                "start": seg_start,
                "end": seg_words[-1]["end"],
                "text": " ".join(w["word"] for w in seg_words),
            })

    duration = segments[-1]["end"] if segments else 0.0
    return full_text, segments, duration


# ─── Main transcription service ───────────────────────────────────────────────

class TranscriptionService:
    """
    Transcription service using Amazon Transcribe.

    The uploaded file is already in S3 after the upload step, so we pass
    the S3 URI directly to Amazon Transcribe — no re-uploading required.
    """

    async def transcribe(
        self,
        file_data: bytes,         # kept for interface compatibility but not re-uploaded
        filename: str,
        s3_key: str = "",         # S3 key of the already-uploaded file
        language_code: str = "",  # e.g. "en-US" — empty = use settings default
    ) -> TranscriptionResult:
        """
        Transcribe a file already stored in S3.

        Args:
            file_data:     Raw bytes (unused — file is already in S3).
            filename:      Original filename, used to detect media format.
            s3_key:        S3 key of the uploaded file.
            language_code: BCP-47 language code override. Falls back to
                           TRANSCRIBE_LANGUAGE_CODE in settings.

        Returns:
            TranscriptionResult with text, segments, language, duration.

        Raises:
            RuntimeError on Transcribe failure.
        """
        lang = language_code or settings.transcribe_language_code
        s3_uri = f"s3://{settings.s3_bucket_name}/{s3_key}"
        media_format = _get_media_format(filename)

        # Unique job name — Transcribe requires globally unique names per account
        job_name = f"glotsync-{uuid.uuid4().hex}"

        log.info(
            "transcribe_job_starting",
            job_name=job_name,
            s3_uri=s3_uri,
            format=media_format,
            lang=lang,
        )

        loop = asyncio.get_event_loop()

        # Start the job
        try:
            await loop.run_in_executor(
                None,
                partial(_start_job, job_name, s3_uri, media_format, lang),
            )
        except Exception as exc:
            log.error("transcribe_start_failed", job_name=job_name, error=str(exc))
            raise RuntimeError(f"Failed to start transcription job: {exc}") from exc

        # Poll until complete (max 30 minutes, polling every 5 seconds)
        max_polls = 360  # 360 × 5s = 30 min
        poll_interval = 5

        for attempt in range(max_polls):
            await asyncio.sleep(poll_interval)

            try:
                response = await loop.run_in_executor(
                    None, partial(_get_job, job_name)
                )
            except Exception as exc:
                log.warning("transcribe_poll_error", attempt=attempt, error=str(exc))
                continue

            job = response.get("TranscriptionJob", {})
            status = job.get("TranscriptionJobStatus", "")

            log.debug("transcribe_poll", job_name=job_name, status=status, attempt=attempt)

            if status == "COMPLETED":
                # Fetch the result JSON from S3.
                # Because we set OutputBucketName, Transcribe writes the result
                # into our own bucket and the TranscriptFileUri is an
                # authenticated S3 URL (NOT presigned). We must read it with
                # credentials via boto3 rather than an anonymous HTTP GET.
                output_key = f"transcribe-output/{job_name}.json"
                result_json = await self._fetch_result(output_key)
                text, segments, duration = _parse_transcribe_result(result_json)

                # Detect the language Amazon Transcribe identified
                detected_lang = job.get("LanguageCode", lang)

                log.info(
                    "transcribe_job_complete",
                    job_name=job_name,
                    duration=duration,
                    words=len(text.split()),
                    lang=detected_lang,
                )

                return TranscriptionResult(
                    text=text,
                    segments=segments,
                    language=detected_lang,
                    duration_seconds=duration,
                )

            elif status == "FAILED":
                reason = job.get("FailureReason", "Unknown error")
                log.error("transcribe_job_failed", job_name=job_name, reason=reason)
                raise RuntimeError(f"Amazon Transcribe job failed: {reason}")

            # IN_PROGRESS or QUEUED — keep polling

        raise RuntimeError(
            f"Transcription timed out after {max_polls * poll_interval // 60} minutes."
        )

    async def _fetch_result(self, output_key: str) -> dict:
        """
        Fetch the Amazon Transcribe JSON result from our own S3 bucket.

        When a custom OutputBucketName is configured, Transcribe stores the
        result in that bucket. The object is private, so we read it with
        authenticated S3 credentials and parse the JSON.
        """
        data = await download_from_s3(output_key)
        return json.loads(data.decode("utf-8"))


# ─── SRT / VTT formatters ─────────────────────────────────────────────────────

def format_srt(segments: list[dict]) -> str:
    """Convert transcript segments to SRT subtitle format."""
    lines = []
    for i, seg in enumerate(segments, 1):
        start = _seconds_to_srt_time(seg["start"])
        end = _seconds_to_srt_time(seg["end"])
        lines.append(f"{i}\n{start} --> {end}\n{seg['text']}\n")
    return "\n".join(lines)


def format_vtt(segments: list[dict]) -> str:
    """Convert transcript segments to WebVTT format."""
    lines = ["WEBVTT\n"]
    for i, seg in enumerate(segments, 1):
        start = _seconds_to_vtt_time(seg["start"])
        end = _seconds_to_vtt_time(seg["end"])
        lines.append(f"{start} --> {end}\n{seg['text']}\n")
    return "\n".join(lines)


def _seconds_to_srt_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _seconds_to_vtt_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


transcription_service = TranscriptionService()
