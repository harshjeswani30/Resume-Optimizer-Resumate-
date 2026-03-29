"""
Route: POST /analyze-jd
Accepts raw job description text and returns structured JD JSON via Groq.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ai.jd_analyzer import analyze_jd

router = APIRouter()


class JDRequest(BaseModel):
    jd_text: str


@router.post("/")
async def analyze_job_description(body: JDRequest):
    if not body.jd_text.strip():
        raise HTTPException(status_code=400, detail="jd_text cannot be empty.")

    try:
        jd_json = await analyze_jd(body.jd_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JD analysis failed: {str(e)}")

    return {"jd_json": jd_json}
