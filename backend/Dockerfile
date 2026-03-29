# Backend Dockerfile — Production-Ready
# Bundles Python + LaTeX (pdflatex) together

# Step 1: Base image with Python 3.10
FROM python:3.10-slim

# Step 2: Install system dependencies (LaTeX + Tools)
# We use texlive-base to keep the image size manageable
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Set working directory
WORKDIR /app

# Step 4: Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Ensure httpx is correct version to fix Groq SDK error
RUN pip install --no-cache-dir httpx==0.27.2

# Step 5: Copy application code
COPY . .

# Step 6: Create output directory
RUN mkdir -p output

# Step 7: Expose port
EXPOSE 8000

# Step 8: Standard production command (Gunicorn + Uvicorn)
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
