"""Gunicorn configuration for production deployment."""
import multiprocessing
import os

# Server socket
bind = "unix:/run/gunicorn/glotsync.sock"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = "/var/log/glotsync/access.log"
errorlog = "/var/log/glotsync/error.log"
loglevel = "warning"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "glotsync-api"

# Security
limit_request_line = 8190
limit_request_fields = 100
limit_request_field_size = 8190
