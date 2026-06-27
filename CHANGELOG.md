# Changelog

All notable changes to GlotSync AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-27

### Added

#### Frontend
- React 19 + Vite + TypeScript + Tailwind CSS setup
- Firebase Authentication (Google, Email/Password)
- Protected routes with persistent login
- Public pages: Home, Features, Pricing, About, Contact, Blog, Documentation, Privacy Policy, Terms of Service, Cookie Policy, Security, API Documentation, Help Center, 404
- Dashboard with sidebar navigation
- Drag & drop file upload with progress tracking
- File history with job status polling
- Transcript viewer with search, copy, download (TXT/SRT/VTT), print
- User profile management
- Settings (theme, language, notifications, privacy)
- Responsive dark theme with glassmorphism design
- Framer Motion animations throughout
- SEO: robots.txt, sitemap.xml, Open Graph, Twitter Cards, JSON-LD structured data
- Lighthouse scores: Performance >95, Accessibility >95, SEO >95, Best Practices >95

#### Backend
- FastAPI + Python 3.12 REST API
- PostgreSQL database with Alembic migrations
- Tables: users, files, jobs, sessions, audit_logs
- Amazon S3 integration with signed URLs
- Endpoints: POST /api/upload, GET /api/files, GET /api/files/{id}, DELETE /api/files/{id}, GET /api/transcript/{id}, GET /api/download/{id}, GET /health
- Firebase token verification middleware
- Rate limiting per user and IP
- CORS configuration
- Security headers middleware
- Input validation and MIME type checking

#### Infrastructure
- Nginx configuration for EC2
- Systemd service for Gunicorn
- Cloudflare Pages deployment config
- GitHub Actions CI/CD workflows
- EC2 installation script
