import asyncio
import os
import sys

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from utils.compiler import compile_tex_to_pdf

sample_tex = r"""
\documentclass{article}
\begin{document}
Hello World!
\end{document}
"""

async def test():
    print("Testing PDF compilation...")
    try:
        output_dir = "output/test"
        os.makedirs(output_dir, exist_ok=True)
        tex_path = os.path.join(output_dir, "simple_test.tex")
        with open(tex_path, "w") as f:
            f.write(sample_tex)
            
        pdf_path = compile_tex_to_pdf(tex_path, output_dir, "simple_test")
        if pdf_path:
            print(f"SUCCESS! PDF generated at: {pdf_path}")
        else:
            print("FAILED! Compilation returned None.")
    except Exception as e:
        print(f"FAILED!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test())
