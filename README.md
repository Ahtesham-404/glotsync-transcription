# GlotSync AI

> Transform Audio & Video Into Accurate, Searchable Transcripts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend: React 19](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://react.dev)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Deploy: Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020.svg)](https://pages.cloudflare.com)
[![Deploy: AWS EC2](https://img.shields.io/badge/Deploy-AWS%20EC2-FF9900.svg)](https://aws.amazon.com/ec2/)

## Overview

GlotSync AI is a production-ready SaaS transcription platform. Upload any audio or video file — get a highly accurate, searchable transcript in minutes. Download as TXT, SRT, or VTT.

**Live at**: [glotsync.online](https://glotsync.online)  
**API**: [api.glotsync.online](https://api.glotsync.online/health)

---

## Features

| Feature | Status |
|---|---|
| Multi-format transcription (11 formats) | ✅ |
| Real-time job status polling | ✅ |
| Searchable transcript viewer | ✅ |
| TXT / SRT / VTT download | ✅ |
| Firebase Auth (Google + Email) | ✅ |
| S3 storage with signed URLs | ✅ |
| Dashboard with usage stats | ✅ |
| Responsive dark-theme UI | ✅ |
| Rate limiting & security headers | ✅ |
| Alembic database migrations | ✅ |
| Background transcription worker | ✅ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| State | TanStack Query v5 |
| Forms | React Hook Form v7 + Zod v4 |
| HTTP | Axios (auto snake_case→camelCase transform) |
| Animation | Framer Motion v12 |
| Icons | Lucide React |
| Auth | Firebase Authentication v12 |
| Backend | FastAPI 0.115, Python 3.12, Uvicorn |
| ORM | SQLAlchemy 2.0 async |
| Migrations | Alembic |
| Database | PostgreSQL 15 |
| Storage | Amazon S3 |
| Transcription | OpenAI Whisper API |
| Hosting (FE) | Cloudflare Pages |
| Hosting (BE) | AWS EC2 Ubuntu 22.04 |

---

## Repository Structure

```
glotsync-ai/
├── frontend/                  # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable UI + layout components
│   │   ├── contexts/          # AuthContext (Firebase)
│   │   ├── hooks/             # TanStack Query hooks
│   │   ├── lib/               # firebase, axios, queryClient, motion, caseTransform
│   │   ├── pages/             # auth/, dashboard/, public/
│   │   └── types/             # TypeScript interfaces
│   ├── public/                # robots.txt, sitemap.xml, favicon, og-image
│   ├── index.html             # SEO meta, JSON-LD, Open Graph
│   ├── _redirects             # Cloudflare Pages SPA routing
│   └── vite.config.ts
│
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── main.py            # App entry, middleware, routers
│   │   ├── config.py          # Settings from environment
│   │   ├── database.py        # SQLAlchemy async engine
│   │   ├── models.py          # ORM models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── auth.py            # Firebase token verification
│   │   ├── storage.py         # S3 operations (non-blocking)
│   │   ├── transcription.py   # OpenAI Whisper integration
│   │   └── routers/           # upload, files, transcripts, dashboard
│   ├── alembic/
│   │   └── versions/          # 001_initial_schema.py
│   ├── gunicorn.conf.py
│   └── requirements.txt
│
├── docs/                      # Full documentation suite
│   ├── aws-setup-guide.md     # Beginner-friendly AWS guide
│   ├── deployment-checklist.md
│   ├── cloudflare-pages-setup.md
│   ├── production-checklist.md
│   ├── architecture.md
│   ├── api-reference.md
│   ├── database-schema.md
│   ├── design.md
│   ├── developer-guide.md
│   └── requirements.md
│
├── .github/workflows/         # CI/CD pipelines
├── README.md
├── LICENSE
├── SECURITY.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

---

## Quick Start

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
npm install
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DB, AWS, Firebase, OpenAI credentials
alembic upgrade head
uvicorn app.main:app --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs
```

---

## Environment Variables

### Frontend (`.env.local`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=GlotSync AI
VITE_MAX_FILE_SIZE_MB=500
```

### Backend (`.env`)

```env
APP_ENV=development
DATABASE_URL=postgresql+asyncpg://glotsync:glotsync@localhost:5432/glotsync
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=glotsync-files
FIREBASE_PROJECT_ID=glotsync-199c1
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Deployment

| Target | Documentation |
|---|---|
| Cloudflare Pages (Frontend) | [cloudflare-pages-setup.md](docs/cloudflare-pages-setup.md) |
| AWS EC2 (Backend) | [aws-setup-guide.md](docs/aws-setup-guide.md) |
| Pre-launch | [production-checklist.md](docs/production-checklist.md) |
| Every deployment | [deployment-checklist.md](docs/deployment-checklist.md) |

---

## API Reference

Base URL: `https://api.glotsync.online`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload file for transcription |
| `GET` | `/api/files` | List user's files |
| `GET` | `/api/files/{id}` | Get file details |
| `DELETE` | `/api/files/{id}` | Delete file |
| `GET` | `/api/jobs/{id}` | Poll job status |
| `GET` | `/api/transcript/{id}` | Get transcript |
| `GET` | `/api/download/{id}` | Get download URL |
| `GET` | `/api/dashboard/stats` | Dashboard statistics |
| `GET` | `/health` | Health check |

See [api-reference.md](docs/api-reference.md) for full documentation.

---

## License

[MIT](LICENSE) © 2025 GlotSync AI
