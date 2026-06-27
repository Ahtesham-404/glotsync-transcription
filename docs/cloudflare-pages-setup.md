# Cloudflare Pages Setup Guide

Complete guide for deploying the GlotSync AI frontend to Cloudflare Pages.

---

## Prerequisites

- Cloudflare account (free tier works)
- GitHub repository with your GlotSync AI code
- Firebase project configured
- Backend API deployed and accessible at `https://api.glotsync.online`

---

## Step 1: Connect GitHub to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Pages** in the left sidebar
3. Click **Create a project** → **Connect to Git**
4. Choose **GitHub** and authorize Cloudflare
5. Select your `glotsync-ai` repository
6. Click **Begin setup**

---

## Step 2: Configure Build Settings

| Setting | Value |
|---|---|
| Project name | `glotsync-ai` |
| Production branch | `main` |
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `frontend` |
| Node.js version | `20` |

---

## Step 3: Set Environment Variables

In the Cloudflare Pages project settings → **Environment variables** → **Production**:

| Variable | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyDzs_6nPxfiy73H2P0L365uZtX6TsiApXg` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `glotsync-199c1.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `glotsync-199c1` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `glotsync-199c1.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `699415663169` |
| `VITE_FIREBASE_APP_ID` | `1:699415663169:web:f4dafb0d3f2a83134dacc0` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-SH5KEL6CYW` |
| `VITE_API_BASE_URL` | `https://api.glotsync.online` |
| `VITE_APP_URL` | `https://glotsync.online` |
| `VITE_APP_NAME` | `GlotSync AI` |
| `VITE_MAX_FILE_SIZE_MB` | `500` |

> Set the same variables for **Preview** deployments but use your staging API URL.

---

## Step 4: Deploy

Click **Save and Deploy**. The first build takes ~2 minutes.

Once complete, your site will be live at `https://glotsync-ai.pages.dev`.

---

## Step 5: Add Custom Domain

1. In your Cloudflare Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `glotsync.online`
4. Click **Continue**
5. Cloudflare will automatically create the DNS record if your domain is on Cloudflare
6. Wait for DNS propagation (usually < 5 minutes)
7. SSL is automatic — Cloudflare issues the certificate

Also add `www.glotsync.online` and set it to redirect to `glotsync.online`.

---

## Step 6: Verify SPA Routing

The `_redirects` file in `frontend/` handles client-side routing:

```
/* /index.html 200
```

This ensures that navigating to `/dashboard/files` directly (or refreshing) serves `index.html` instead of a 404.

Verify it works:
1. Deploy the app
2. Navigate to `https://glotsync.online/pricing`
3. Refresh the page — should stay on the pricing page, not 404

---

## Step 7: Configure Cloudflare Settings

In Cloudflare Dashboard → your domain → **Rules** → **Page Rules** (or **Configuration Rules** in the new UI):

### Cache Rules
- Cache HTML files: **Bypass** (React apps change with each deploy)
- Cache static assets (`/assets/*`): **Cache Everything**, Edge Cache TTL: 1 month

### Security
- SSL/TLS: **Full (strict)**
- Enable **HSTS** with max-age 31536000
- Enable **Always Use HTTPS**
- Minimum TLS Version: **1.2**
- Enable **Automatic HTTPS Rewrites**

---

## Automatic Deployments

Every push to the `main` branch automatically triggers a new Cloudflare Pages build. Preview deployments are created for every pull request.

To manually trigger a deployment:
1. Go to your Pages project
2. Click **Deployments** → **Create deployment**
3. Or push any commit to `main`

---

## Verifying the Deployment

After deployment, verify:

1. `https://glotsync.online` loads the homepage
2. Navigation works: /features, /pricing, /about, /contact, /blog, /docs
3. Sign up creates an account
4. Login redirects to dashboard
5. Dashboard loads stats (may show empty on new installation)
6. Upload page accepts files
7. 404 page shows for `/nonexistent-route`
8. `https://glotsync.online/robots.txt` is accessible
9. `https://glotsync.online/sitemap.xml` is accessible

---

## Build Optimization

The Vite config includes code splitting for optimal performance:

| Chunk | Size (gzip) | Content |
|---|---|---|
| react-vendor | ~64 KB | React + ReactDOM |
| firebase | ~40 KB | Firebase Auth |
| framer | ~43 KB | Framer Motion |
| forms | ~30 KB | RHF + Zod |
| Per-page chunks | 1–10 KB | Individual pages |

Total initial load: ~150 KB gzip (main + react-vendor + router).

---

## Troubleshooting

### Build fails with "Cannot find module"
- Check that `package.json` lists all dependencies (not devDependencies for runtime packages)
- Verify Node.js version is set to 20 in Cloudflare Pages settings

### Environment variables not available at build
- Ensure variables are set under **Build configurations** → **Environment variables**
- Variable names must start with `VITE_` to be included in the client bundle

### SPA routing returns 404
- Verify `frontend/_redirects` contains exactly: `/* /index.html 200`
- Ensure the file is in the build output (`dist/_redirects`)

### Firebase auth fails in production
- Add `glotsync.online` to Firebase Console → Authentication → Settings → Authorized domains
- Verify `VITE_FIREBASE_AUTH_DOMAIN` matches your Firebase project
