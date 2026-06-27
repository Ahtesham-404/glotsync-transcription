# Contributing to GlotSync AI

Thank you for your interest in contributing to GlotSync AI.

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 15+
- AWS CLI configured
- Firebase project

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Add your Firebase config values
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in database, S3, Firebase config
alembic upgrade head
uvicorn app.main:app --reload
```

## Code Standards

### TypeScript / React

- Strict TypeScript — no `any` types
- Functional components with hooks
- Props interfaces for all components
- Named exports preferred
- Zod schemas for all form validation

### Python / FastAPI

- Type hints on all functions
- Pydantic models for all request/response schemas
- Async endpoints throughout
- Meaningful exception handling
- Docstrings on all public functions

## Commit Convention

```
feat: add SRT download support
fix: correct timestamp parsing in transcript viewer
docs: update API reference for /upload endpoint
chore: bump fastapi to 0.111.0
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes following the convention above
4. Run linting: `npm run lint` (frontend), `ruff check .` (backend)
5. Run type checks: `npm run type-check` (frontend), `mypy app/` (backend)
6. Push and open a Pull Request against `main`
7. Fill in the PR template completely

## Code of Conduct

Be respectful, constructive, and professional in all interactions.
