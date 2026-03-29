# Gunicorn configuration for FastAPI Production
import multiprocessing
import os

# Socket path
bind = "0.0.0.0:8000"

# Worker processes: 2 x cores + 1 is a good rule of thumb
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stdout
loglevel = "info"

# Timeout: Resume optimization can take ~30-60s with Groq/LaTeX
timeout = 120
keepalive = 5

# Graceful timeout
graceful_timeout = 30
