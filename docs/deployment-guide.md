# Deployment Guide

## Overview

- **Frontend**: Cloudflare Pages (static React SPA)
- **Backend**: AWS EC2 Ubuntu 22.04 LTS
- **Database**: PostgreSQL (local on EC2; migrate to RDS for scale)
- **Storage**: Amazon S3

---

## Cloudflare Pages (Frontend)

### Prerequisites

- Cloudflare account
- GitHub repository connected to Cloudflare Pages

### Steps

1. Go to **Cloudflare Dashboard → Pages → Create a Project**
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend`

4. Add **Environment Variables** (Production):

| Variable | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `glotsync-199c1.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `glotsync-199c1` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `glotsync-199c1.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `699415663169` |
| `VITE_FIREBASE_APP_ID` | Your Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-SH5KEL6CYW` |
| `VITE_API_BASE_URL` | `https://api.glotsync.online` |
| `VITE_APP_URL` | `https://glotsync.online` |
| `VITE_APP_NAME` | `GlotSync AI` |
| `VITE_MAX_FILE_SIZE_MB` | `500` |

5. The `_redirects` file in `frontend/` handles SPA client-side routing:
   ```
   /* /index.html 200
   ```

6. Add your custom domain `glotsync.online` in the Cloudflare Pages settings.

---

## AWS EC2 (Backend)

### Instance Recommendation

- **Type**: t3.medium (2 vCPU, 4 GB RAM) for starter; t3.large for production
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 40 GB gp3 SSD (for OS + logs)
- **Security Group**: Inbound 443 (HTTPS), 22 (SSH from your IP only)

### Installation

1. SSH into your instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. Download and run the install script:
   ```bash
   sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/glotsyncai/glotsync-ai/main/docs/install.sh)"
   ```

3. Configure environment:
   ```bash
   sudo nano /etc/glotsync/environment
   ```
   Fill in all values from `.env.example`.

4. Add Firebase service account:
   ```bash
   sudo nano /etc/glotsync/firebase-service-account.json
   # Paste your Firebase Admin SDK JSON key
   sudo chmod 600 /etc/glotsync/firebase-service-account.json
   sudo chown glotsync:glotsync /etc/glotsync/firebase-service-account.json
   ```

5. Issue SSL certificate:
   ```bash
   sudo certbot --nginx -d api.glotsync.online
   ```

6. Restart services:
   ```bash
   sudo systemctl restart glotsync
   sudo systemctl reload nginx
   ```

### Verify

```bash
curl https://api.glotsync.online/health
```

Expected:
```json
{"status":"healthy","version":"1.0.0","database":"connected","storage":"connected"}
```

### Monitoring

Logs:
```bash
sudo journalctl -u glotsync -f    # Gunicorn/app logs
sudo tail -f /var/log/nginx/glotsync_access.log
```

---

## Amazon S3 Setup

1. Create bucket: `glotsync-files`
2. Block all public access (all files served via signed URLs only)
3. Create IAM user `glotsync-api` with policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:HeadObject"],
      "Resource": "arn:aws:s3:::glotsync-files/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:HeadBucket"],
      "Resource": "arn:aws:s3:::glotsync-files"
    }
  ]
}
```

4. Generate and add access key/secret to `/etc/glotsync/environment`.

---

## Firebase Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key
3. Save as `/etc/glotsync/firebase-service-account.json` on the EC2 instance
4. Enable Email/Password and Google Sign-In in Authentication → Sign-in Methods
5. Add `glotsync.online` to Authorized Domains

---

## Database Migration

To migrate from local PostgreSQL to AWS RDS:

1. Update `DATABASE_URL` in `/etc/glotsync/environment` to point to the RDS endpoint
2. Run: `alembic upgrade head`
3. No application code changes needed — SQLAlchemy is database-agnostic
