#!/usr/bin/env bash
# GlotSync AI — EC2 Ubuntu installation script
# Run as root on a fresh Ubuntu 22.04 LTS instance
set -euo pipefail

echo "=== GlotSync AI Installation ==="

# System packages
apt-get update -y
apt-get install -y \
    python3.13 python3.13-venv python3.13-dev \
    postgresql postgresql-contrib \
    nginx certbot python3-certbot-nginx \
    git curl unzip build-essential \
    libpq-dev ffmpeg

# Create app user
id -u glotsync &>/dev/null || useradd --system --shell /bin/bash --home /opt/glotsync glotsync
mkdir -p /opt/glotsync /etc/glotsync /var/log/glotsync
chown glotsync:glotsync /opt/glotsync /var/log/glotsync

# Clone or update repo
if [ -d /opt/glotsync/backend ]; then
    cd /opt/glotsync/backend && git pull
else
    git clone https://github.com/glotsyncai/glotsync-ai.git /opt/glotsync/repo
    ln -sf /opt/glotsync/repo/backend /opt/glotsync/backend
fi

# Python virtualenv
python3.13 -m venv /opt/glotsync/venv
/opt/glotsync/venv/bin/pip install --upgrade pip
/opt/glotsync/venv/bin/pip install -r /opt/glotsync/backend/requirements.txt

# PostgreSQL setup
sudo -u postgres psql -c "CREATE USER glotsync WITH PASSWORD 'CHANGE_ME';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE glotsync OWNER glotsync;" 2>/dev/null || true

# Environment file (edit this)
if [ ! -f /etc/glotsync/environment ]; then
    cp /opt/glotsync/backend/.env.example /etc/glotsync/environment
    echo "⚠️  Edit /etc/glotsync/environment with your configuration!"
fi
chmod 600 /etc/glotsync/environment

# Run migrations
cd /opt/glotsync/backend
source /etc/glotsync/environment
DATABASE_URL="${DATABASE_URL:-postgresql+asyncpg://glotsync:CHANGE_ME@localhost:5432/glotsync}"
export DATABASE_URL
/opt/glotsync/venv/bin/alembic upgrade head

# Systemd service
cp /opt/glotsync/repo/docs/glotsync.service /etc/systemd/system/glotsync.service
systemctl daemon-reload
systemctl enable glotsync
systemctl restart glotsync

# Nginx
cp /opt/glotsync/repo/docs/nginx.conf /etc/nginx/sites-available/glotsync-api
ln -sf /etc/nginx/sites-available/glotsync-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo ""
echo "=== Installation complete ==="
echo "Next steps:"
echo "  1. Edit /etc/glotsync/environment"
echo "  2. Add Firebase service account to /etc/glotsync/firebase-service-account.json"
echo "  3. Run: certbot --nginx -d api.glotsync.online"
echo "  4. systemctl restart glotsync"
