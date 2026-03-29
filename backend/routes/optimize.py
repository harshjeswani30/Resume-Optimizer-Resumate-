"""
Route: POST /optimize-resume
Takes Resume JSON + JD JSON and returns AI-optimized Resume JSON.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict

from ai.optimizer import optimize_resume, optimize_raw_tex

router = APIRouter()


class OptimizeRequest(BaseModel):
    resume_json: Dict[str, Any]
    jd_json: Dict[str, Any]


@router.post("/")
async def optimize(body: OptimizeRequest):
    if not body.resume_json:
        raise HTTPException(status_code=400, detail="resume_json is required.")
    if not body.jd_json:
        raise HTTPException(status_code=400, detail="jd_json is required.")

    try:
        # Check if we have raw LaTeX source to optimize directly
        raw_tex = body.resume_json.get("_raw_tex")
        
        if raw_tex:
            optimized_tex = await optimize_raw_tex(raw_tex, body.jd_json)
            # Return both JSON and the direct TeX
            return {
                "optimized_json": body.resume_json, # Keep original parsed JSON for UI meta
                "optimized_tex": optimized_tex
            }
        
        # Standard flow: optimize the JSON content
        optimized = await optimize_resume(body.resume_json, body.jd_json)
        return {"optimized_json": optimized}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")
