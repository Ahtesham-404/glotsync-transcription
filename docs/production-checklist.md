# Production Checklist

Complete pre-launch verification for GlotSync AI.

---

## Security

- [ ] No hardcoded secrets in source code (grep for any API keys, passwords)
- [ ] `.env` files are in `.gitignore` and not committed
- [ ] Firebase service account JSON is NOT in the repository
- [ ] `APP_SECRET_KEY` is a random 64-character string (not the default)
- [ ] All S3 bucket public access is blocked
- [ ] EC2 SSH is restricted to known IP addresses
- [ ] CORS is configured for `https://glotsync.online` only (not `*`)
- [ ] Rate limiting is active (`RATE_LIMIT_PER_MINUTE=60`)
- [ ] HTTPS enforced everywhere (Cloudflare + Nginx + HSTS headers)
- [ ] PostgreSQL password is strong and unique
- [ ] IAM user `glotsync-api` has minimal permissions (S3 only)
- [ ] Firebase Auth has only `glotsync.online` as authorized domain

## Functionality

- [ ] Google Sign-In works end-to-end
- [ ] Email registration works (verification email received)
- [ ] Email login works
- [ ] Forgot password flow works
- [ ] Persistent login works (refresh page, stay logged in)
- [ ] Logout works and redirects to home
- [ ] File upload: drag & drop works
- [ ] File upload: browse files works
- [ ] File validation: rejects unsupported formats
- [ ] File validation: rejects files over size limit
- [ ] Upload progress bar displays
- [ ] Job status polling works (queued → processing → completed)
- [ ] Transcript viewer displays full text
- [ ] Transcript search highlights matches
- [ ] Copy transcript to clipboard works
- [ ] Download TXT works
- [ ] Download SRT works
- [ ] Download VTT works
- [ ] Print transcript works
- [ ] Delete file works (with confirmation modal)
- [ ] File pagination works
- [ ] Dashboard stats display
- [ ] Profile page: display name update works
- [ ] Profile page: password change works
- [ ] Profile page: delete account works
- [ ] Settings page: toggles save correctly

## Pages

- [ ] `/` — Home page loads fully
- [ ] `/features` — Features page loads
- [ ] `/pricing` — Pricing page with toggle loads
- [ ] `/about` — About page loads
- [ ] `/contact` — Contact form submits
- [ ] `/blog` — Blog page loads
- [ ] `/docs` — Documentation page loads
- [ ] `/help` — Help Center search works
- [ ] `/api-docs` — API reference loads
- [ ] `/privacy` — Privacy Policy loads
- [ ] `/terms` — Terms of Service loads
- [ ] `/cookies` — Cookie Policy loads
- [ ] `/security` — Security page loads
- [ ] `/login` — Login form works
- [ ] `/register` — Registration form works
- [ ] `/forgot-password` — Password reset flow works
- [ ] `/verify-email` — Verification page works
- [ ] `/dashboard` — Dashboard loads (authenticated)
- [ ] `/dashboard/upload` — Upload page loads
- [ ] `/dashboard/files` — Files list loads
- [ ] `/dashboard/history` — History loads
- [ ] `/dashboard/downloads` — Downloads loads
- [ ] `/dashboard/profile` — Profile loads
- [ ] `/dashboard/settings` — Settings loads
- [ ] `/nonexistent` — Custom 404 page displays
- [ ] Refreshing any dashboard route stays on that route (SPA routing works)

## SEO & Performance

- [ ] `https://glotsync.online/robots.txt` accessible
- [ ] `https://glotsync.online/sitemap.xml` accessible and valid
- [ ] `<title>` tag present on all pages
- [ ] `<meta name="description">` present
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] JSON-LD structured data valid
- [ ] Canonical URL tag present
- [ ] Google Fonts loaded (Inter visible in UI)
- [ ] First page load < 3 seconds on 4G connection
- [ ] Lighthouse Performance score > 90

## Accessibility

- [ ] All interactive elements keyboard-navigable
- [ ] Focus states visible on all buttons/links
- [ ] All images have alt text (or are decorative with aria-hidden)
- [ ] Color contrast ≥ 4.5:1 for body text
- [ ] Skip-to-content link present
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers (role="alert")
- [ ] Modals trap focus and close on Escape
- [ ] ARIA labels on icon-only buttons

## API

- [ ] `GET /health` returns `{"status":"healthy"}`
- [ ] `POST /api/upload` returns 201 with fileId and jobId
- [ ] `GET /api/files` returns paginated list
- [ ] `GET /api/files/{id}` returns file details
- [ ] `DELETE /api/files/{id}` deletes the file
- [ ] `GET /api/jobs/{id}` returns job status
- [ ] `GET /api/transcript/{id}` returns transcript
- [ ] `GET /api/download/{id}` returns signed URL
- [ ] `GET /api/dashboard/stats` returns stats
- [ ] All endpoints return 401 without a valid token
- [ ] All endpoints return proper error messages

## Infrastructure

- [ ] `systemctl status glotsync` is active/running
- [ ] `systemctl status nginx` is active/running
- [ ] `systemctl status postgresql` is active/running
- [ ] SSL certificate is valid and not expiring within 30 days
- [ ] S3 bucket exists and is accessible
- [ ] Database has all tables (alembic_version shows 001)
- [ ] Log files rotating correctly
- [ ] Automatic restarts enabled (`systemctl enable glotsync`)
