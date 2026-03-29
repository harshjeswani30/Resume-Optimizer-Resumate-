"""
Main Application Entry Point (Production Refactor)
FastAPI Backend orchestrating the full Resume Optimization Pipeline.
"""
import os
import uuid
import json
import re
from pathlib import Path
from typing import Dict, Any

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Internal Imports (Production Refactored Modules)
from parsers.resume_parser import ResumeParser
from parsers.jd_parser import JDParser
from optimizers.ai_optimizer import AIOptimizer
from optimizers.keyword_matcher import KeywordMatcher
from generators.latex_generator import LaTeXGenerator
from utils.compiler import compile_tex_to_pdf
from utils.storage import upload_to_storage, cleanup_files

load_dotenv()

app = FastAPI(
    title="AI Resume Optimizer — Production API",
    description="Unified pipeline for Resume Parsing, AI Optimization, and LaTeX PDF Generation.",
    version="2.0.0"
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Configuration ──────────────────────────────────────────────────────────
OUTPUT_DIR = Path("./output")
OUTPUT_DIR.mkdir(exist_ok=True)
app.mount("/output", StaticFiles(directory=str(OUTPUT_DIR)), name="output")

# Initialize Services
resume_parser = ResumeParser()
jd_parser = JDParser()
optimizer = AIOptimizer()
matcher = KeywordMatcher()
generator = LaTeXGenerator()

@app.post("/api/optimize-resume")
async def api_optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Main Multi-stage Pipeline:
    Upload -> Parse -> Initial Score -> AI Optimize -> Tailored Score -> LaTeX/PDF -> Return URLs
    """
    job_id = str(uuid.uuid4())[:12]
    temp_dir = OUTPUT_DIR / job_id
    temp_dir.mkdir(exist_ok=True)
    
    try:
        # 1. Save uploaded file
        resume_ext = os.path.splitext(resume.filename)[1].lower()
        temp_file_path = temp_dir / f"original{resume_ext}"
        with open(temp_file_path, "wb") as f:
            f.write(await resume.read())

        # 2. Parse Resume to JSON
        print(f"[{job_id}] Parsing resume...")
        resume_json = resume_parser.parse(str(temp_file_path))

        # 3. Analyze Job Description
        print(f"[{job_id}] Analyzing Job Description...")
        jd_json = jd_parser.parse(job_description)

        # 4. Calculate Initial Score and Identify Missing Keywords (The "ATS Checker" phase)
        initial_report = matcher.generate_report(resume_json, jd_json)
        initial_score = matcher.calculate_match_score(resume_json, jd_json)
        missing_keywords = initial_report.get("missing_keywords", [])

        # 5. AI Optimization (Content Rewriting with ATS Feedback)
        print(f"[{job_id}] Deep tailoring via AI (Fixing {len(missing_keywords)} missing keywords)...")
        optimized_json = await optimizer.optimize(resume_json, jd_json, missing_keywords)

        # 6. Calculate Optimized Score
        optimized_score = matcher.calculate_match_score(optimized_json, jd_json)

        # 7. Generate LaTeX Source
        print(f"[{job_id}] Generating LaTeX source...")
        tex_source = generator.generate(optimized_json) or ""
        tex_file_path = temp_dir / f"resume_{job_id}.tex"
        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(tex_source)
        
        # 7b. Persist JSON data for refinement
        with open(temp_dir / "optimized_resume.json", "w", encoding="utf-8") as f:
            json.dump(optimized_json, f, indent=2)
        with open(temp_dir / "jd_analysis.json", "w", encoding="utf-8") as f:
            json.dump(jd_json, f, indent=2)

        # 8. Compile to PDF
        print(f"[{job_id}] Compiling PDF...")
        pdf_path, page_count = compile_tex_to_pdf(str(tex_file_path), str(temp_dir), job_id)
        
        if not pdf_path:
            raise HTTPException(status_code=500, detail="LaTeX compilation failed. Check debug logs.")

        # 9. Upload/Get URLs
        # In production, this uploads to S3. Here we return local URLs.
        # We include the job_id in the object_name to match our folder structure
        pdf_url = upload_to_storage(pdf_path, f"{job_id}/resume_{job_id}.pdf")
        tex_url = upload_to_storage(str(tex_file_path), f"{job_id}/resume_{job_id}.tex")
        
        # 10. Generate Keyword Report
        report = matcher.generate_report(optimized_json, jd_json)

        return JSONResponse({
            "success": True,
            "job_id": job_id,
            "initial_score": initial_score,
            "optimized_score": optimized_score,
            "improvement": round(optimized_score - initial_score, 1),
            "pdf_url": pdf_url,
            "tex_url": tex_url,
            "tex_source": tex_source,
            "page_count": page_count,
            "is_multi_page": page_count > 1,
            "report": report
        })

    except Exception as e:
        import traceback
        print(f"ERROR: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/refine-to-one-page")
async def api_refine_to_one_page(job_id: str = Form(...)):
    """
    Surgically shorten an existing optimized resume to fit on one page.
    """
    print(f"[DEBUG] Received refinement request for Job ID: {job_id}")
    temp_dir = OUTPUT_DIR / job_id
    if not temp_dir.exists():
        print(f"[DEBUG] Job directory NOT FOUND: {temp_dir}")
        raise HTTPException(status_code=404, detail="Job ID not found or expired.")
    
    try:
        # 1. Load persisted data
        print(f"[DEBUG] Loading persisted data for {job_id}...")
        try:
            with open(temp_dir / "optimized_resume.json", "r", encoding="utf-8") as f:
                optimized_json = json.load(f)
            with open(temp_dir / "jd_analysis.json", "r", encoding="utf-8") as f:
                jd_json = json.load(f)
        except Exception as e:
            print(f"[DEBUG] Error reading persisted files: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to load job data: {str(e)}")
            
        # 2. Run refinement AI
        print(f"[{job_id}] Running refinement AI...")
        try:
            refined_json = await optimizer.refine_to_one_page(optimized_json, jd_json)
            print(f"[DEBUG] Refinement AI response received for {job_id}")
        except Exception as e:
            print(f"[DEBUG] Refinement AI Failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"AI Refinement failed: {str(e)}")
        
        # 3. Re-calculate Score
        print(f"[DEBUG] Re-calculating score for {job_id}...")
        try:
            new_score = matcher.calculate_match_score(refined_json, jd_json)
        except Exception as e:
            print(f"[DEBUG] Score calculation failed: {str(e)}")
            new_score = 0.0 # Fallback
            
        # 4. Re-generate LaTeX
        print(f"[DEBUG] Re-generating LaTeX for {job_id}...")
        try:
            tex_source = generator.generate(refined_json)
            if not tex_source:
                raise ValueError("Generator returned empty source")
            tex_file_path = temp_dir / f"resume_{job_id}.tex"
            with open(tex_file_path, "w", encoding="utf-8") as f:
                f.write(tex_source)
        except Exception as e:
            print(f"[DEBUG] LaTeX generation failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"LaTeX regeneration failed: {str(e)}")
            
        # 5. Re-compile PDF
        print(f"[DEBUG] Compiling PDF for {job_id}...")
        pdf_path, page_count = compile_tex_to_pdf(str(tex_file_path), str(temp_dir), job_id)
        
        if not pdf_path:
            print(f"[DEBUG] PDF Compilation failed for {job_id}")
            raise HTTPException(status_code=500, detail="Refinement compilation failed. AI might have introduced invalid LaTeX.")
            
        # 6. Get new URLs
        print(f"[DEBUG] Uploading files for {job_id}...")
        pdf_url = upload_to_storage(pdf_path, f"{job_id}/resume_{job_id}.pdf")
        tex_url = upload_to_storage(str(tex_file_path), f"{job_id}/resume_{job_id}.tex")
        
        # 7. Update persisted data with refined version
        with open(temp_dir / "optimized_resume.json", "w", encoding="utf-8") as f:
            json.dump(refined_json, f, indent=2)
            
        print(f"[DEBUG] Refinement complete for {job_id}. Pages: {page_count}")
        return JSONResponse({
            "success": True,
            "job_id": job_id,
            "initial_score": 0, # Placeholders for refinement
            "optimized_score": new_score,
            "improvement": 0,
            "pdf_url": pdf_url,
            "tex_url": tex_url,
            "tex_source": tex_source,
            "page_count": page_count,
            "is_multi_page": page_count > 1,
            "report": matcher.generate_report(refined_json, jd_json)
        })
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        print(f"REFINE ERROR: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal Refinement Error: {str(e)}")

@app.post("/api/compile-resume")
async def api_compile_resume(
    job_id: str = Form(...),
    tex_source: str = Form(...)
):
    """
    Fast-track compilation for the Editor. 
    Accepts raw LaTeX source and an existing job_id.
    """
    temp_dir = OUTPUT_DIR / job_id
    temp_dir.mkdir(parents=True, exist_ok=True) # Ensure it exists

    try:
        # 1. Update the .tex file
        tex_file_path = temp_dir / f"resume_{job_id}.tex"
        print(f"[{job_id}] Saving Editor changes to {tex_file_path}...")
        
        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(tex_source)

        # 2. Re-compile
        print(f"[{job_id}] Re-compiling from Editor...")
        pdf_path, page_count = compile_tex_to_pdf(str(tex_file_path), str(temp_dir), job_id)
        
        if not pdf_path:
            # Check debug log
            log_path = temp_dir / f"debug_{job_id}.log"
            error_msg = "LaTeX syntax error."
            if log_path.exists():
                with open(log_path, "r", encoding="utf-8") as f:
                    log_data = f.read()
                    if "! LaTeX Error:" in log_data:
                        # Extract the error line
                        match = re.search(r"! LaTeX Error: (.*)", log_data)
                        if match: error_msg = f"LaTeX Error: {match.group(1)}"
                    elif "Undefined control sequence" in log_data:
                         error_msg = "Undefined control sequence. Check your LaTeX commands."

            raise HTTPException(status_code=400, detail=error_msg)

        # 3. Get URL
        pdf_url = upload_to_storage(pdf_path, f"{job_id}/resume_{job_id}.pdf")

        return JSONResponse({
            "success": True,
            "pdf_url": pdf_url,
            "page_count": page_count,
            "job_id": job_id
        })
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"COMPILE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "production-resume-optimizer"}
