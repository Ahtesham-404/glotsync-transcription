# Deployment Checklist

Use this checklist before every production deployment of GlotSync AI.

---

## Pre-Deployment

### Code
- [ ] All TypeScript errors resolved (`npx tsc --noEmit` exits 0)
- [ ] Frontend builds successfully (`npm run build` exits 0, no errors)
- [ ] No `.env`, secrets, or service account files committed to git
- [ ] All environment variables documented in `.env.example`
- [ ] `CHANGELOG.md` updated with release notes

### Backend
- [ ] Python dependencies pinned in `requirements.txt`
- [ ] Alembic migration files are committed
- [ ] All new migrations tested locally
- [ ] No syntax errors (`python -m py_compile app/main.py`)

---

## AWS Infrastructure

### IAM
- [ ] IAM user `glotsync-api` created
- [ ] S3 policy attached (PutObject, GetObject, DeleteObject, HeadObject on `glotsync-files/*`)
- [ ] Access key ID and secret generated and stored securely
- [ ] No admin/root credentials used by the application

### Amazon S3
- [ ] Bucket `glotsync-files` created in the correct region
- [ ] Public access blocked on all settings
- [ ] Server-side encryption enabled (AES-256)
- [ ] Bucket CORS configured for `https://glotsync.online`
- [ ] Lifecycle policy set for file retention (Free: 7d, Starter: 30d, Pro: 90d)

### EC2
- [ ] Ubuntu 22.04 LTS instance running
- [ ] Elastic IP associated
- [ ] Security group: inbound 443 (HTTPS), 22 (SSH from your IP only)
- [ ] Security group: outbound all (for S3, Firebase, OpenAI API calls)

---

## Backend Deployment

- [ ] Repository cloned/pulled on EC2
- [ ] Python 3.12 virtual environment created and activated
- [ ] `pip install -r requirements.txt` completed without errors
- [ ] `/etc/glotsync/environment` configured with all required variables:
  - `DATABASE_URL`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_BUCKET_NAME`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_SERVICE_ACCOUNT_PATH`
  - `OPENAI_API_KEY`
  - `ALLOWED_ORIGINS`
  - `APP_ENV=production`
  - `APP_SECRET_KEY` (random 64-char string)
- [ ] `/etc/glotsync/firebase-service-account.json` placed and `chmod 600`
- [ ] `alembic upgrade head` completed successfully
- [ ] `systemctl start glotsync` — service started
- [ ] `systemctl enable glotsync` — auto-start on reboot enabled
- [ ] `curl http://localhost:8000/health` returns `{"status":"healthy"}`

### Nginx
- [ ] Nginx config copied to `/etc/nginx/sites-available/glotsync-api`
- [ ] Symlink created in sites-enabled
- [ ] `nginx -t` passes
- [ ] SSL certificate issued: `certbot --nginx -d api.glotsync.online`
- [ ] `systemctl reload nginx`
- [ ] `curl https://api.glotsync.online/health` returns healthy

---

## Frontend Deployment (Cloudflare Pages)

- [ ] Cloudflare Pages project connected to GitHub
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Root directory: `frontend`
- [ ] All `VITE_*` environment variables set in Cloudflare Pages dashboard
- [ ] `_redirects` file present in `frontend/` (SPA fallback)
- [ ] Custom domain `glotsync.online` added and verified
- [ ] SSL active (automatic via Cloudflare)
- [ ] Build triggers: production branch = `main`

---

## Firebase

- [ ] Google Sign-In enabled in Firebase Authentication
- [ ] Email/Password Sign-In enabled
- [ ] Authorized domains include: `glotsync.online`, `localhost`
- [ ] Firebase config values match `.env.local` / Cloudflare Pages env vars

---

## Post-Deployment Verification

- [ ] `https://glotsync.online` loads the landing page
- [ ] `https://api.glotsync.online/health` returns healthy
- [ ] Google Sign-In works end-to-end
- [ ] Email registration works, verification email received
- [ ] File upload completes and job appears as "Queued"
- [ ] Transcription completes (requires `OPENAI_API_KEY`)
- [ ] Transcript viewer displays correctly
- [ ] Download TXT, SRT, VTT all work
- [ ] Delete file works
- [ ] 404 page displays for unknown routes
- [ ] Mobile layout renders correctly
- [ ] All public pages accessible: /features, /pricing, /about, etc.

---

## Monitoring

- [ ] CloudWatch agent installed (optional but recommended)
- [ ] Log groups created: `/var/log/glotsync/`, `/var/log/nginx/`
- [ ] Alerts configured for 5xx errors
- [ ] Uptime monitoring set up (e.g., UptimeRobot, Better Uptime)

---

## Rollback Plan

If deployment fails:
1. `sudo systemctl restart glotsync` — restart the service
2. `git revert HEAD && git push` — revert the last commit
3. `alembic downgrade -1` — roll back one migration
4. `sudo systemctl restart glotsync`
