import asyncio
import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from utils.compiler import compile_tex_to_pdf
from generators.latex_generator import LaTeXGenerator

# Sample data
resume_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123-456-7890",
    "summary": "Experienced engineer.",
    "education": [{"institution": "Test University", "year": "2020", "degree": "BS CS", "gpa": "3.8"}],
    "skills": {"languages": ["Python", "C++"], "frameworks": ["React"]},
    "experience": [{"company": "Tech Corp", "title": "Developer", "duration": "2 years", "bullets": ["Improved performance."]}],
    "projects": [{"name": "Project A", "tech": "FastAPI", "bullets": ["Built X."]}],
    "certifications": ["AWS Certified"]
}

async def test():
    print("Testing Professional Template compilation...")
    try:
        # 1. Initialize Generator
        # We need to point to the correct templates directory
        generator = LaTeXGenerator(template_dir="backend/templates", template_name="resume.tex.j2")
        
        # 2. Render the actual template
        tex_source = generator.generate(resume_data)
        print("Template rendered successfully.")
        
        # 3. Create temp output dir for test
        output_dir = "output/test"
        os.makedirs(output_dir, exist_ok=True)
        
        # 4. Save .tex for compilation
        tex_file_path = os.path.join(output_dir, "test_resume.tex")
        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(tex_source)

        pdf_path = compile_tex_to_pdf(tex_file_path, output_dir, "test_env")
        if pdf_path:
            print(f"SUCCESS! PDF generated at: {pdf_path}")
        else:
            print("FAILED! Compilation returned None. Check debug_test_env.log in output/test/")
    except Exception as e:
        print(f"FAILED!")
        print(f"Error Message:\n{str(e)}")

if __name__ == "__main__":
    asyncio.run(test())
