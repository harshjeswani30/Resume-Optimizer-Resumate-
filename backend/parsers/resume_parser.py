"""
Resume Parser Module (Production Refactor)
Extracts structured JSON from PDF, DOCX, or .tex files via Groq.
"""
import os
import json
import re
import pdfplumber
from docx import Document
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class ResumeParser:
    def __init__(self):
        self.client = Groq()
        self.model = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
        self.prompt = """You are a professional resume parser. Given raw resume text, extract and return ONLY a valid JSON object matching this exact schema:

{
  "name": "string",
  "email": "string",
  "phone": "string",
   "linkedin": "string or empty string",
  "github": "string or empty string",
  "leetcode": "string or empty string",
  "portfolio": "string or empty string",
  "location": "string or empty string",
  "summary": "string or empty string",
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string",
      "gpa": "string or empty string"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": "string",
      "bullets": ["string"],
      "link": "string or empty string"
    }
  ],
  "skills": {
    "languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"],
    "other": ["string"]
  },
  "certifications": ["string"],
  "co_curricular": [
    {
      "name": "string",
      "role": "string",
      "tenure": "string",
      "bullets": ["string"]
    }
  ]
}

Rules:
- Return ONLY valid JSON. No markdown, no explanation.
- If a field is not present, use an empty string or empty array.
- Preserve all real facts — do not invent anything.
- SOCIAL LINKS: Pay extremely close attention to LinkedIn, GitHub, LeetCode, and Portfolio. Even if they appear as just text with a URL in parentheses (e.g., "LinkedIn (https://...)"), extract the full URL into the corresponding JSON field. 
- PHONE: Prefer professional formatting (e.g., +91-XXXXXXXXXX).
"""

    def parse(self, path: str) -> Dict[str, Any]:
        """Entry point for parsing any supported file type."""
        ext = os.path.splitext(path)[1].lower()
        
        if ext == ".pdf":
            raw_text = self._extract_text_pdf(path)
        elif ext == ".docx":
            raw_text = self._extract_text_docx(path)
        elif ext == ".tex":
            raw_text = self._extract_text_tex(path)
        else:
            raise ValueError(f"Unsupported extension: {ext}")

        if not raw_text.strip():
            raise ValueError("Could not extract text from the file.")

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.prompt},
                {"role": "user", "content": f"Parse this resume:\n\n{raw_text[:8000]}"},
            ],
            temperature=0.1,
        )

        raw_response = response.choices[0].message.content.strip()
        cleaned_json = self._clean_json_response(raw_response)
        
        try:
            parsed_data = json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            print(f"FAILED JSON: {cleaned_json}")
            raise ValueError(f"AI returned invalid JSON: {str(e)}")
        
        # Keep raw tex if applicable
        if ext == ".tex":
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                parsed_data["_raw_tex"] = f.read()
                
        return parsed_data
    def _clean_json_response(self, text: str) -> str:
        """Strip markdown and extra text to extract ONLY the JSON block."""
        # 1. Try to find content between triple backticks
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
        if match:
            return match.group(1).strip()
        
        # 2. Try to find content between first { and last }
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match:
            return match.group(1).strip()
            
        return text.strip()

    def _extract_text_pdf(self, path: str) -> str:
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()

    def _extract_text_docx(self, path: str) -> str:
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())

    def _extract_text_tex(self, path: str) -> str:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # 1. Handle \href{URL}{TEXT}
        # For social links, we want both. For tel/mailto, we just want the text to avoid duplication.
        def replace_href(match):
            url = match.group(1).strip()
            text = match.group(2).strip()
            if url.startswith(("tel:", "mailto:")):
                return text
            # If the text is just a label (like "LinkedIn") or same as URL, format it for the AI
            if len(text) < 20 or text.lower() in url.lower():
                return f"{text} ({url})"
            return f"{text} {url}"
            
        content = re.sub(r"\\href\{([^}]*)\}\{([^}]*)\}", replace_href, content)
        
        # 2. Handle simple \url{URL} -> Keep the URL
        content = re.sub(r"\\url\{([^}]*)\}", r" \1 ", content)

        # 3. Strip remaining standard LaTeX commands but keep their curly-brace content
        # e.g., \textbf{Skills} -> Skills
        content = re.sub(r"\\[a-zA-Z]+\*?(\[.*?\])?", " ", content)

        # 4. Clean up remaining braces, percent signs, and extra whitespace
        content = re.sub(r"[{}%]", " ", content)
        
        return " ".join(content.split())
