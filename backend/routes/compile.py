"""
Route: POST /compile-pdf
Takes a .tex source string, compiles it with pdflatex, and returns the PDF URL + tex source.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from latex.compiler import compile_tex_to_pdf

router = APIRouter()


class CompileRequest(BaseModel):
    tex_source: str


@router.post("/")
async def compile_pdf(body: CompileRequest):
    if not body.tex_source.strip():
        raise HTTPException(status_code=400, detail="tex_source is required.")

    try:
        pdf_url = await compile_tex_to_pdf(body.tex_source)
    except Exception as e:
        import traceback
        error_detail = f"{str(e)}\n{traceback.format_exc() if 'Internal Server Error' in str(e) else ''}"
        raise HTTPException(status_code=500, detail=f"PDF compilation failed: {error_detail}")

    return {
        "pdf_url": pdf_url,
        "tex_source": body.tex_source,
    }
