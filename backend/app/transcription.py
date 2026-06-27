"""
Transcription service integration.

This module provides the interface for transcribing audio/video files.
The default implementation uses OpenAI Whisper API.
Replace or extend the `TranscriptionService` class to integrate a different provider.
"""
import io
import structlog
from typing import Any

from app.config import get_settings

log = structlog.get_logger(__name__)
settings = get_settings()


class TranscriptionResult:
    """Normalized transcription output."""

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


class TranscriptionService:
    """
    Transcription service using OpenAI Whisper API.

    To use a different provider, subclass this and override `transcribe`.
    """

    async def transcribe(self, audio_bytes: bytes, filename: str) -> TranscriptionResult:
        """
        Transcribe audio bytes and return a TranscriptionResult.

        Raises RuntimeError on failure.
        """
        if not settings.openai_api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not configured. "
                "Set it in your .env file to enable transcription."
            )

        # Import here to avoid hard dependency when key isn't set
        import httpx

        # Whisper API supports: mp3, mp4, mpeg, mpga, m4a, wav, webm, flac
        headers = {"Authorization": f"Bearer {settings.openai_api_key}"}

        async with httpx.AsyncClient(timeout=300.0) as client:
            files = {
                "file": (filename, io.BytesIO(audio_bytes), "application/octet-stream"),
                "model": (None, "whisper-1"),
                "response_format": (None, "verbose_json"),
                "timestamp_granularities[]": (None, "segment"),
            }
            response = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers=headers,
                files=files,
            )

        if response.status_code != 200:
            log.error("whisper_api_error", status=response.status_code, body=response.text[:500])
            raise RuntimeError(f"Whisper API error: {response.status_code}")

        data = response.json()
        text = data.get("text", "")
        language = data.get("language", "en")
        duration = data.get("duration", 0.0)

        segments = []
        for i, seg in enumerate(data.get("segments", [])):
            segments.append({
                "id": i,
                "start": seg.get("start", 0.0),
                "end": seg.get("end", 0.0),
                "text": seg.get("text", "").strip(),
            })

        return TranscriptionResult(
            text=text,
            segments=segments,
            language=language,
            duration_seconds=float(duration),
        )


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
