import subprocess
import shutil
import os

def test_pdflatex():
    cmd = "pdflatex"
    fallback = r"C:\Users\Admin\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe"
    
    found = shutil.which(cmd)
    print(f"shutil.which('pdflatex'): {found}")
    
    if not found and os.path.exists(fallback):
        cmd = fallback
        print(f"Using fallback: {cmd}")
    elif not found:
        print("❌ pdflatex NOT FOUND in PATH or fallback!")
    
    try:
        result = subprocess.run([cmd, "--version"], capture_output=True, text=True)
        print(f"✅ pdflatex version: {result.stdout.splitlines()[0]}")
    except Exception as e:
        print(f"❌ Failed to run pdflatex: {e}")

if __name__ == "__main__":
    test_pdflatex()
