# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users (Browsers)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                    Cloudflare Pages                             │
│              React 19 SPA (glotsync.online)                     │
│   - Firebase Auth (client-side)                                 │
│   - TanStack Query API calls                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + Firebase ID Token
┌────────────────────────────▼────────────────────────────────────┐
│                     AWS EC2 Ubuntu                              │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    Nginx (TLS termination)               │  │
│   └──────────────────────┬───────────────────────────────────┘  │
│                          │ Unix socket                          │
│   ┌──────────────────────▼───────────────────────────────────┐  │
│   │              Gunicorn + Uvicorn workers                  │  │
│   │              FastAPI application                         │  │
│   │  - Firebase token verification                           │  │
│   │  - Rate limiting (slowapi)                               │  │
│   │  - REST API endpoints                                    │  │
│   └──────────┬──────────────────────┬────────────────────────┘  │
│              │ asyncpg              │ boto3                     │
│   ┌──────────▼─────────┐  ┌────────▼──────────────────────┐    │
│   │   PostgreSQL        │  │        Amazon S3               │    │
│   │  (local / RDS)      │  │   glotsync-files bucket        │    │
│   │  - users            │  │   - uploads/{uid}/{fid}/file   │    │
│   │  - files            │  │   - transcripts/{fid}/txt      │    │
│   │  - jobs             │  │   - transcripts/{fid}/srt      │    │
│   │  - transcripts      │  │   - transcripts/{fid}/vtt      │    │
│   │  - sessions         │  └───────────────────────────────┘    │
│   │  - audit_logs       │                                       │
│   └────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
Browser          Firebase           Backend            Database
   │                │                  │                  │
   │──sign in──────►│                  │                  │
   │◄──ID token─────│                  │                  │
   │                │                  │                  │
   │────POST /api/upload + Bearer token──────────────────►│
   │                │                  │                  │
   │                │◄──verify token───│                  │
   │                │───decoded claims►│                  │
   │                │                  │──get/create user►│
   │                │                  │◄──user record────│
   │                │                  │                  │
   │◄──201 Created─────────────────────│                  │
```

## File Processing Flow

```
1. Client POSTs multipart file → /api/upload
2. API validates MIME type and size
3. File stored in S3: uploads/{user_id}/{file_id}/{filename}
4. File + Job records created in PostgreSQL (status: queued)
5. API returns { fileId, jobId }
6. Background worker (Celery/ARQ) picks up job:
   a. Downloads file from S3
   b. Sends to Whisper API
   c. Generates TXT, SRT, VTT
   d. Uploads transcripts to S3
   e. Updates Job (status: completed, transcript_id)
   f. Updates Transcript record
7. Frontend polls GET /api/jobs/{jobId} until completed
8. User views transcript via GET /api/transcript/{transcriptId}
9. Downloads via GET /api/download/{fileId}?format=srt
```

## Technology Decisions

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | React 19 | Latest stable, concurrent mode |
| Styling | Tailwind CSS v4 | Utility-first, no runtime overhead |
| State management | TanStack Query | Server state, caching, polling |
| Auth | Firebase Authentication | Managed, secure, Google/Email/Password |
| Backend | FastAPI | Async Python, automatic OpenAPI docs |
| ORM | SQLAlchemy async | Type-safe, migration-friendly |
| Migrations | Alembic | Industry standard for SQLAlchemy |
| Hosting (FE) | Cloudflare Pages | Global CDN, free tier, edge network |
| Hosting (BE) | AWS EC2 | Full control, cost-effective |
| Storage | Amazon S3 | Durable, cheap, signed URLs |
| Transcription | OpenAI Whisper | High accuracy, 50+ languages |
