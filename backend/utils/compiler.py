"""
Compiler Utility (Production Refactor)
Handles synchronous pdflatex compilation with timeouts and debug logging.
"""
import os
import subprocess
import traceback
import pdfplumber
from pathlib import Path
from typing import Optional, Tuple

def compile_tex_to_pdf(tex_path: str, output_dir: str, job_id: str) -> Tuple[Optional[str], int]:
    """
    Compile a .tex file to PDF using pdflatex.
    Returns (path_to_pdf, page_count). Path is None on failure.
    """
    tex_file = Path(tex_path)
    output_path = Path(output_dir)
    pdf_name = f"resume_{job_id}.pdf"
    log_name = f"debug_{job_id}.log"
    
    # Use explicit absolute path for MiKTeX on Windows
    pdflatex_exe = r"C:\Users\Admin\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe"
    if not os.path.exists(pdflatex_exe):
        pdflatex_exe = "pdflatex" # Fallback to PATH

    try:
        # Pass 1: Initial compilation
        result = subprocess.run(
            [
                pdflatex_exe,
                "-interaction=nonstopmode",
                "-halt-on-error",
                f"-output-directory={output_path}",
                f"-jobname=resume_{job_id}",
                str(tex_file)
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120, # MiKTeX can be slow
            cwd=os.getcwd()
        )

        # Write debug log
        with open(output_path / log_name, "w", encoding="utf-8") as f:
            f.write(f"JOB ID: {job_id}\n")
            f.write(f"COMMAND: {pdflatex_exe}\n")
            f.write("-" * 40 + "\n")
            f.write(f"STDOUT:\n{result.stdout}\n")
            f.write(f"STDERR:\n{result.stderr}\n")

        if result.returncode == 0:
            pdf_path = output_path / pdf_name
            if pdf_path.exists():
                # Detect page count
                page_count = 0
                try:
                    with pdfplumber.open(pdf_path) as pdf:
                        page_count = len(pdf.pages)
                except Exception as page_e:
                    print(f"Page count detection failed: {page_e}")
                
                return str(pdf_path), page_count
        
        # On failure, copy the .tex to a failed_ file for inspection
        failed_tex = output_path / f"failed_{job_id}.tex"
        import shutil
        shutil.copy(tex_file, failed_tex)
        return None, 0

    except Exception as e:
        with open(output_path / log_name, "a", encoding="utf-8") as f:
            f.write(f"\nCRITICAL EXCEPTION:\n{traceback.format_exc()}\n")
        return None, 0
