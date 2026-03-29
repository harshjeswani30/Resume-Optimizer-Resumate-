"""
Route: POST /generate-latex
Takes optimized Resume JSON and renders the fixed Jinja2 LaTeX template.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict

from latex.engine import render_latex

router = APIRouter()


class LatexRequest(BaseModel):
    optimized_json: Dict[str, Any]


@router.post("/")
async def generate_latex(body: LatexRequest):
    if not body.optimized_json:
        raise HTTPException(status_code=400, detail="optimized_json is required.")

    try:
        tex_source = render_latex(body.optimized_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LaTeX generation failed: {str(e)}")

    return {"tex_source": tex_source}
