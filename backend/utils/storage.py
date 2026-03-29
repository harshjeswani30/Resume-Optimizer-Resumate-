"""
Storage Utility (Production Refactor)
Handles file upload to S3/Supabase and local cleanup.
"""
import os
import shutil
from pathlib import Path
from typing import Optional

def upload_to_storage(file_path: str, object_name: str) -> str:
    """
    Placeholder for S3/Supabase upload.
    Currently returns a local /output/ URL for development.
    """
    # In production: 
    # s3.upload_file(file_path, BUCKET, object_name)
    # return f"https://{BUCKET}.s3.amazonaws.com/{object_name}"
    
    # Developmental / Local fallback:
    # Use the object_name directly as the suffix to preserve subfolders (e.g. job_id/file.pdf)
    return f"http://localhost:8000/output/{object_name}"

def cleanup_files(directory: str):
    """Delete temporary folders after processing."""
    path = Path(directory)
    if path.exists():
        shutil.rmtree(path)
