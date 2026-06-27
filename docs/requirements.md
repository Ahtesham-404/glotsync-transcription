# Requirements

## Functional Requirements

### Authentication
- [x] Google Sign-In via Firebase
- [x] Email/Password registration and login
- [x] Email verification
- [x] Password reset via email
- [x] Remember Me (persistent session)
- [x] Logout
- [x] Protected routes

### File Upload
- [x] Drag & drop upload
- [x] Browse files upload
- [x] Upload progress bar
- [x] Cancel upload
- [x] Retry failed upload
- [x] MIME type validation
- [x] File size validation (configurable max)
- [x] Supported: MP3, WAV, AAC, M4A, FLAC, OGG, MP4, MOV, AVI, MKV, WEBM

### Transcription
- [x] Queue → Upload → Processing → Completed / Failed states
- [x] Real-time job status polling
- [x] Error messaging on failure

### Transcript Viewer
- [x] Full-text search
- [x] Copy to clipboard
- [x] Download TXT
- [x] Download SRT
- [x] Download VTT
- [x] Print transcript
- [x] Word count display
- [x] Duration display
- [x] Timestamp view toggle
- [x] Language display

### Dashboard
- [x] Total uploads stat
- [x] Completed jobs stat
- [x] Storage used with progress bar
- [x] Recent activity feed
- [x] Quick upload action

### User Profile
- [x] Display picture
- [x] Display name editing
- [x] Email display
- [x] Change password
- [x] Delete account (with confirmation)

### Settings
- [x] Language preference
- [x] Default download format
- [x] Notification preferences
- [x] Privacy preferences

### Public Website
- [x] Home page with hero, features, how it works, FAQ, CTA
- [x] Features page
- [x] Pricing page (Free, Starter, Pro, Enterprise)
- [x] About page
- [x] Contact page with form
- [x] Blog page
- [x] Documentation page
- [x] Help Center with search
- [x] API Reference page
- [x] Privacy Policy
- [x] Terms of Service
- [x] Cookie Policy
- [x] Security page
- [x] 404 page

## Non-Functional Requirements

### Performance
- [x] Code splitting per route
- [x] Lazy loading of all pages
- [x] Tree shaking
- [x] Bundle optimization (manualChunks)
- [x] Image-free (SVG icons, CSS gradients)
- Target: Lighthouse Performance >95

### Accessibility
- [x] ARIA labels on interactive elements
- [x] Focus-visible styles
- [x] Semantic HTML structure
- [x] Screen reader compatible navigation
- Target: WCAG AA, Lighthouse Accessibility >95

### SEO
- [x] robots.txt
- [x] sitemap.xml
- [x] Open Graph meta tags
- [x] Twitter Card meta tags
- [x] JSON-LD structured data
- [x] Canonical URLs
- Target: Lighthouse SEO >95

### Security
- [x] Firebase ID token verification on all API endpoints
- [x] MIME type validation
- [x] File size limits
- [x] Rate limiting (slowapi)
- [x] CORS configured for known origins
- [x] Security headers (CSP, HSTS, X-Frame-Options)
- [x] Signed S3 URLs (15 min expiry)
- [x] No secrets in source code
- [x] Parameterized SQL queries (SQLAlchemy ORM)

### Scalability
- [x] Async PostgreSQL (asyncpg)
- [x] Stateless backend (sessions in Firebase/DB)
- [x] S3 for file storage (scales infinitely)
- [x] Database migration system (Alembic)
- [x] Architecture supports migration to RDS without code changes
