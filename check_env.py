import subprocess
import os

def check_env():
    print("========================================")
    print("   AI RESUME OPTIMIZER — SYSTEM CHECK")
    print("========================================\n")

    # 1. Check Python Dependencies
    print("[1/3] Checking Python dependencies...")
    try:
        import fastapi, pdfplumber, groq, jinja2
        print("✅ Python dependencies: INSTALLED\n")
    except ImportError as e:
        print(f"❌ Missing: {e.name}. Run 'pip install -r backend/requirements.txt'\n")

    # 2. Check LaTeX (CRITICAL for PDF)
    print("[2/3] Checking LaTeX (pdflatex)...")
    fallback_path = r"C:\Users\Admin\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe"
    try:
        result = subprocess.run(["pdflatex", "--version"], capture_output=True, text=True)
        print("✅ LaTeX (pdflatex): INSTALLED (in PATH)")
        print(f"   Version found: {result.stdout.splitlines()[0][:50]}...\n")
    except FileNotFoundError:
        if os.path.exists(fallback_path):
             print(f"✅ LaTeX (pdflatex): FOUND (at absolute path)")
             print(f"   Note: It's installed but not yet in your terminal PATH.\n")
        else:
            print("❌ LaTeX (pdflatex): NOT FOUND")
            print("   >>> ACTION REQUIRED: Install MiKTeX from https://miktex.org/download")
            print("   >>> This is mandatory for generating the final PDF output.\n")

    # 3. Check pnpm (Frontend)
    print("[3/3] Checking Frontend (pnpm)...")
    try:
        result = subprocess.run(["pnpm", "--version"], capture_output=True, text=True)
        print(f"✅ pnpm: INSTALLED (v{result.stdout.strip()})\n")
    except FileNotFoundError:
        print("❌ pnpm: NOT FOUND. Run 'npm install -g pnpm'\n")

    print("========================================")
    if os.path.exists("backend/.env"):
        print("💡 Found .env file — ensure your GROQ_API_KEY is saved inside.")
    else:
        print("⚠️  Missing .env file in backend/ folder.")
    print("========================================")

if __name__ == "__main__":
    check_env()
