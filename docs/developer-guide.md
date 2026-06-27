# Developer Guide

## Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 15+
- AWS CLI configured (for S3)
- Firebase project with service account

## Local Development

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in Firebase config values from your Firebase project
npm install
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd backend
python3.13 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in DATABASE_URL, AWS credentials, Firebase project ID
alembic upgrade head
uvicorn app.main:app --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs (dev only)
```

### Database setup

```bash
createdb glotsync
psql -d glotsync -c "CREATE USER glotsync WITH PASSWORD 'glotsync';"
psql -d glotsync -c "GRANT ALL PRIVILEGES ON DATABASE glotsync TO glotsync;"
```

## Frontend Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── layout/        # PublicLayout, DashboardLayout, Sidebar, TopNav, Footer
│   └── ui/            # Button, Input, Card, Modal, Badge, Toast, Spinner, ...
├── contexts/
│   └── AuthContext.tsx   # Firebase auth state
├── hooks/
│   ├── useFiles.ts        # TanStack Query file operations
│   ├── useTranscript.ts   # Transcript fetching
│   └── useDashboard.ts    # Dashboard stats
├── lib/
│   ├── firebase.ts        # Firebase initialization (env vars only)
│   ├── axios.ts           # Axios with Firebase token interceptor
│   ├── queryClient.ts     # TanStack Query config
│   └── motion.ts          # Framer Motion helpers
├── pages/
│   ├── auth/              # Login, Register, ForgotPassword, VerifyEmail
│   ├── dashboard/         # DashboardHome, Upload, Files, History, Downloads, Transcript, Profile, Settings
│   └── public/            # Home, Features, Pricing, About, Contact, Blog, Docs, Help, API, Legal, 404
└── types/
    └── index.ts           # All TypeScript interfaces
```

## Backend Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app, middleware, routers
│   ├── config.py          # Settings from environment
│   ├── database.py        # SQLAlchemy async engine
│   ├── models.py          # ORM models
│   ├── schemas.py         # Pydantic request/response schemas
│   ├── auth.py            # Firebase token verification
│   ├── storage.py         # S3 operations
│   ├── transcription.py   # Amazon Transcribe integration
│   └── routers/
│       ├── upload.py      # POST /api/upload
│       ├── files.py       # GET/DELETE /api/files
│       ├── transcripts.py # GET /api/transcript, /api/download
│       └── dashboard.py   # GET /api/dashboard/stats
├── alembic/
│   └── versions/          # Migration files
├── requirements.txt
└── gunicorn.conf.py
```

## Adding a New API Endpoint

1. Create route function in `app/routers/`
2. Add Pydantic schemas to `app/schemas.py`
3. Register router in `app/main.py`
4. Update `docs/api-reference.md`

## Running Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "describe change"

# Apply all pending migrations
alembic upgrade head

# Downgrade one step
alembic downgrade -1
```

## Code Standards

### Frontend (TypeScript)
- No `any` types
- All components have typed props interfaces
- Zod schemas for all form validation
- Named exports preferred

### Backend (Python)
- Type hints on all functions
- Pydantic models for all endpoints
- Async everywhere — no sync DB/IO calls
- `structlog` for all logging (not `print`)
- Meaningful exception messages

## Environment Variables

### Frontend (Vite)
All env vars must be prefixed with `VITE_`. See `.env.example`.

### Backend (FastAPI)
Loaded by `pydantic-settings` from `.env` file. See `.env.example`.

**Never commit real secrets to git.**
