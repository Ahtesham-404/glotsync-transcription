# API Reference

Base URL: `https://api.glotsync.online`

All authenticated endpoints require:
```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

---

## POST /api/upload

Upload an audio or video file for transcription.

**Request**: `multipart/form-data`
- `file`: audio or video file

**Supported formats**: MP3, WAV, AAC, M4A, FLAC, OGG, MP4, MOV, AVI, MKV, WEBM

**Response**: `201 Created`
```json
{
  "file_id": "uuid",
  "job_id": "uuid",
  "message": "File uploaded and queued for transcription"
}
```

**Errors**:
- `413` File too large
- `422` Unsupported format
- `500` Storage failure

---

## GET /api/files

List all files for the authenticated user.

**Query params**:
- `page` (int, default 1)
- `page_size` (int, default 20, max 100)

**Response**: `200 OK`
```json
{
  "items": [{ "id": "...", "original_name": "...", "job": { "status": "completed" } }],
  "total": 42,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

---

## GET /api/files/{file_id}

Get a single file by ID.

**Response**: `200 OK` — FileOut schema

---

## DELETE /api/files/{file_id}

Delete a file and its associated transcripts.

**Response**: `200 OK`
```json
{ "message": "File deleted successfully" }
```

---

## GET /api/jobs/{job_id}

Poll the status of a transcription job.

**Response**: `200 OK`
```json
{
  "id": "...",
  "status": "queued|uploading|processing|completed|failed",
  "progress": 75,
  "transcript_id": "...",
  "error_message": null
}
```

Job status progression: `queued` → `uploading` → `processing` → `completed` / `failed`

---

## GET /api/transcript/{transcript_id}

Retrieve the full transcript.

**Response**: `200 OK`
```json
{
  "id": "...",
  "text": "Hello world...",
  "segments": [
    { "id": 0, "start": 0.0, "end": 2.4, "text": "Hello world..." }
  ],
  "language": "en",
  "duration_seconds": 540,
  "word_count": 1203
}
```

---

## GET /api/download/{file_id}

Get a presigned S3 download URL.

**Query params**:
- `format`: `txt` | `srt` | `vtt` | `original`

**Response**: `200 OK`
```json
{
  "download_url": "https://s3.amazonaws.com/...",
  "expires_at": "2025-06-27T10:15:00Z"
}
```

---

## GET /api/dashboard/stats

Dashboard statistics for the authenticated user.

**Response**: `200 OK` — DashboardStats schema

---

## GET /health

API health check (no authentication required).

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-06-27T10:00:00Z",
  "database": "connected",
  "storage": "connected"
}
```

---

## Error Format

All errors return:
```json
{ "detail": "Human-readable error message" }
```

HTTP status codes:
- `400` Bad request
- `401` Unauthorized (invalid/missing token)
- `403` Forbidden
- `404` Not found
- `413` Payload too large
- `422` Validation error
- `429` Rate limit exceeded
- `500` Internal server error
