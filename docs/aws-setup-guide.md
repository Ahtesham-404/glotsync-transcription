# AWS Setup Guide

This is a complete, beginner-friendly guide to setting up GlotSync AI on AWS.
Follow every step in order. Do not skip steps.

---

## 1. Create an AWS Account

1. Go to https://aws.amazon.com and click **Create an AWS Account**
2. Enter your email address and choose a root user password
3. Select **Personal** account type
4. Enter billing information (a credit card is required — AWS has a free tier)
5. Verify your phone number
6. Select the **Basic support plan** (free)
7. Sign in to the AWS Management Console

> ⚠️ **NEVER use your root account for daily operations.** Create an IAM user in the next step.

---

## 2. Create an IAM Admin User

1. In the AWS Console, search for **IAM** and open it
2. Click **Users** → **Create user**
3. Username: `glotsync-admin`
4. Check **Provide user access to the AWS Management Console**
5. Choose **I want to create an IAM user**
6. Set a password
7. Click **Next** → **Attach policies directly**
8. Search and attach: `AdministratorAccess`
9. Click **Create user**
10. **Save the console sign-in URL, username, and password**

Sign out of root and sign in as `glotsync-admin` from now on.

---

## 3. Create IAM User for the Application

This user will have minimal permissions — only what the app needs.

1. IAM → **Users** → **Create user**
2. Username: `glotsync-api`
3. Do NOT enable console access (programmatic only)
4. Click **Next** → **Attach policies directly**
5. Click **Create policy** (new tab) → **JSON** tab
6. Paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::glotsync-files/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:HeadBucket"
      ],
      "Resource": "arn:aws:s3:::glotsync-files"
    }
  ]
}
```

7. Name: `GlotSyncS3Policy` → **Create policy**
8. Back in the user creation tab, refresh and attach `GlotSyncS3Policy`
9. **Create user**
10. Click the user → **Security credentials** → **Create access key**
11. Use case: **Application running outside AWS**
12. **Save the Access Key ID and Secret Access Key** — you will not see the secret again

---

## 4. Install AWS CLI

On your local machine:

```bash
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli

# Windows (PowerShell)
winget install Amazon.AWSCLI
```

Configure:
```bash
aws configure
glotsync-admin
PV4ZA1Jb6dRGvM+kWe4hcx1IlV0h9KpubCSrLl79
us-east-1
json
# AWS Access Key ID: paste your glotsync-admin key
# AWS Secret Access Key: paste your secret
# Default region name: us-east-1
# Default output format: json

```

---

## 5. Create Amazon S3 Bucket

```bash
# Create the bucket
aws s3api create-bucket \
  --bucket glotsync-files \
  --region us-east-1

# Block all public access
aws s3api put-public-access-block \
  --bucket glotsync-files \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket glotsync-files \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### Configure CORS for the bucket

Create a file `cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["https://glotsync.online", "http://localhost:5173"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply it:
```bash
aws s3api put-bucket-cors --bucket glotsync-files --cors-configuration file://cors.json
```

---

## 6. Create Security Group for EC2

```bash
# Create security group
aws ec2 create-security-group \
  --group-name glotsync-api-sg \
  --description "GlotSync API security group"

# Allow HTTPS (443) from everywhere
aws ec2 authorize-security-group-ingress \
  --group-name glotsync-api-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# Allow HTTP (80) for Let's Encrypt redirect
aws ec2 authorize-security-group-ingress \
  --group-name glotsync-api-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# Allow SSH from your IP only
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --group-name glotsync-api-sg \
  --protocol tcp --port 22 --cidr "${MY_IP}/32"
```

---

## 7. Launch EC2 Instance

1. AWS Console → **EC2** → **Launch Instance**
2. **Name**: `glotsync-api`
3. **AMI**: Ubuntu Server 22.04 LTS (64-bit x86)
4. **Instance type**: `t3.medium` (recommended minimum)
5. **Key pair**: Create a new key pair
   - Name: `glotsync-key`
   - Type: RSA, format `.pem`
   - **Download and save the .pem file**
6. **Network settings**: Select existing security group → `glotsync-api-sg`
7. **Storage**: 40 GiB gp3
8. Click **Launch instance**

```bash
# Make the key file secure
chmod 400 ~/glotsync-key.pem
```

---

## 8. Assign Elastic IP

1. EC2 → **Elastic IPs** → **Allocate Elastic IP address**
2. Click **Allocate**
3. Select the new IP → **Actions** → **Associate Elastic IP address**
4. Select your `glotsync-api` instance
5. Click **Associate**
6. **Note the Elastic IP address** — this is your server's permanent IP

---

## 9. Connect via SSH

```bash
ssh -i ~/glotsync-key.pem ubuntu@YOUR_ELASTIC_IP
```

---

## 10. Ubuntu Server Setup

Once connected:

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install essentials
sudo apt-get install -y \
  python3.12 python3.12-venv python3.12-dev \
  postgresql postgresql-contrib \
  nginx certbot python3-certbot-nginx \
  git curl build-essential libpq-dev \
  ffmpeg unzip

# Check Python version
python3.12 --version
```

---

## 11. Configure PostgreSQL

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER glotsync WITH PASSWORD 'STRONG_PASSWORD_HERE';"
sudo -u postgres psql -c "CREATE DATABASE glotsync OWNER glotsync;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE glotsync TO glotsync;"

# Verify connection
psql "postgresql://glotsync:STRONG_PASSWORD_HERE@localhost:5432/glotsync" -c "SELECT 1;"
```

---

## 12. Deploy the Application

```bash
# Create app user
sudo useradd --system --shell /bin/bash --home /opt/glotsync glotsync
sudo mkdir -p /opt/glotsync /etc/glotsync /var/log/glotsync
sudo chown glotsync:glotsync /opt/glotsync /var/log/glotsync

# Clone repository
sudo -u glotsync git clone https://github.com/YOUR_GITHUB/glotsync-ai.git /opt/glotsync/repo

# Set up Python environment
sudo -u glotsync python3.12 -m venv /opt/glotsync/venv
sudo -u glotsync /opt/glotsync/venv/bin/pip install --upgrade pip
sudo -u glotsync /opt/glotsync/venv/bin/pip install -r /opt/glotsync/repo/backend/requirements.txt
```

---

## 13. Configure Environment Variables

```bash
sudo cp /opt/glotsync/repo/backend/.env.example /etc/glotsync/environment
sudo nano /etc/glotsync/environment
```

Fill in ALL values:
```
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=<generate: python3 -c "import secrets; print(secrets.token_hex(32))">
ALLOWED_ORIGINS=https://glotsync.online

DATABASE_URL=postgresql+asyncpg://glotsync:STRONG_PASSWORD_HERE@localhost:5432/glotsync

AWS_ACCESS_KEY_ID=<your glotsync-api access key>
AWS_SECRET_ACCESS_KEY=<your glotsync-api secret>
AWS_REGION=us-east-1
S3_BUCKET_NAME=glotsync-files

FIREBASE_PROJECT_ID=glotsync-199c1
FIREBASE_SERVICE_ACCOUNT_PATH=/etc/glotsync/firebase-service-account.json

OPENAI_API_KEY=sk-your-openai-api-key

MAX_FILE_SIZE_MB=500
RATE_LIMIT_PER_MINUTE=60
```

```bash
sudo chmod 600 /etc/glotsync/environment
```

---

## 14. Add Firebase Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Download the JSON file
4. Copy it to the server:

```bash
# On your local machine:
scp -i ~/glotsync-key.pem firebase-service-account.json \
  ubuntu@YOUR_ELASTIC_IP:/tmp/

# On the server:
sudo mv /tmp/firebase-service-account.json /etc/glotsync/firebase-service-account.json
sudo chmod 600 /etc/glotsync/firebase-service-account.json
sudo chown glotsync:glotsync /etc/glotsync/firebase-service-account.json
```

---

## 15. Run Database Migrations

```bash
cd /opt/glotsync/repo/backend
source /etc/glotsync/environment
export DATABASE_URL
sudo -u glotsync /opt/glotsync/venv/bin/alembic upgrade head
```

---

## 16. Configure Systemd Service

```bash
sudo cp /opt/glotsync/repo/docs/glotsync.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable glotsync
sudo systemctl start glotsync

# Check status
sudo systemctl status glotsync

# Test locally
curl http://localhost:8000/health
```

Expected: `{"status":"healthy","version":"1.0.0",...}`

---

## 17. Configure Nginx

```bash
sudo cp /opt/glotsync/repo/docs/nginx.conf /etc/nginx/sites-available/glotsync-api
sudo ln -sf /etc/nginx/sites-available/glotsync-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 18. Issue SSL Certificate

Make sure your domain `api.glotsync.online` has an A record pointing to your Elastic IP before running this:

```bash
sudo certbot --nginx -d api.glotsync.online
# Follow prompts: enter email, agree to terms
```

---

## 19. Configure Cloudflare DNS

1. Log in to Cloudflare dashboard
2. Select your domain `glotsync.online`
3. Go to **DNS** → **Records**
4. Add A record:
   - Name: `api`
   - IPv4 address: `YOUR_ELASTIC_IP`
   - Proxy status: **DNS only** (orange cloud OFF for API to allow Let's Encrypt)
5. For the frontend (Cloudflare Pages):
   - Cloudflare Pages handles this automatically when you add a custom domain

---

## 20. Verify Production Deployment

```bash
# Test HTTPS API
curl https://api.glotsync.online/health

# Expected:
# {"status":"healthy","version":"1.0.0","database":"connected","storage":"connected"}
```

Open `https://glotsync.online` in your browser and verify everything works.

---

## Maintenance

### Restart the service
```bash
sudo systemctl restart glotsync
```

### Deploy a new version
```bash
cd /opt/glotsync/repo
sudo -u glotsync git pull origin main
sudo -u glotsync /opt/glotsync/venv/bin/pip install -r backend/requirements.txt
cd backend && source /etc/glotsync/environment && export DATABASE_URL
sudo -u glotsync /opt/glotsync/venv/bin/alembic upgrade head
sudo systemctl restart glotsync
```

### View logs
```bash
sudo journalctl -u glotsync -f                    # Live app logs
sudo tail -f /var/log/nginx/glotsync_access.log   # Nginx access logs
sudo tail -f /var/log/nginx/glotsync_error.log    # Nginx error logs
```

### Database backup
```bash
pg_dump -U glotsync glotsync > backup_$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Service won't start
```bash
sudo journalctl -u glotsync --no-pager -n 50
```

### Database connection refused
```bash
sudo systemctl status postgresql
# If stopped: sudo systemctl start postgresql
```

### 502 Bad Gateway from Nginx
```bash
sudo systemctl status glotsync
# Check that glotsync.sock exists: ls /run/gunicorn/
```

### SSL certificate renewal
```bash
sudo certbot renew --dry-run     # Test renewal
sudo certbot renew               # Actual renewal
# Certbot auto-renews via a systemd timer — verify with:
sudo systemctl status certbot.timer
```

### Permission denied on S3
- Verify the IAM policy is attached to the `glotsync-api` user
- Check the access key in `/etc/glotsync/environment`
- Test with: `aws s3 ls s3://glotsync-files --profile glotsync-api`
