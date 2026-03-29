"""
Route: POST /upload-resume
Accepts a resume file (PDF, DOCX, or .tex) and returns structured Resume JSON.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile, os

from parser.resume_parser import parse_resume

router = APIRouter()


@router.post("/")
async def upload_resume(file: UploadFile = File(...)):
    allowed = {".pdf", ".docx", ".tex"}
    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(allowed)}",
        )

    # Save to a temp file so parsers can read it
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        resume_json = parse_resume(tmp_path, ext)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")
    finally:
        os.unlink(tmp_path)

    return {"resume_json": resume_json}
