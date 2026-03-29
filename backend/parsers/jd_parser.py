"""
JD Parser Module (Production Refactor)
Extracts technical keywords, role title, and responsibilities from JD via Groq.
"""
import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class JDParser:
    def __init__(self):
        self.client = Groq()
        self.model = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
        self.prompt = """You are a technical recruiter. Given a job description, extract and return ONLY a valid JSON object with this exact schema:

{
  "role": "string — job title",
  "company": "string or empty string",
  "required_skills": ["string — technical skills explicitly required"],
  "preferred_skills": ["string — nice-to-have skills"],
  "keywords": ["string — important technical and action keywords to include in a resume"],
  "responsibilities": ["string — key duties"],
  "action_verbs": ["string — relevant action verbs e.g. Developed, Led, Built"]
}

Rules:
- Return ONLY valid JSON. No markdown, no explanation.
- ATOMIC KEYWORDS: Be comprehensive but keep keywords ATOMIC. For example, instead of "aws services (kinesis, msk, lambda, glue)", extract them as separate items: ["AWS Services", "Kinesis", "MSK", "Lambda", "Glue"].
- DO NOT include punctuation in keywords.
"""

    def parse(self, jd_text: str) -> Dict[str, Any]:
        """Send JD text to Groq and return structured JD JSON."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.prompt},
                {"role": "user", "content": f"Analyze this job description:\n\n{jd_text[:6000]}"},
            ],
            temperature=0.1,
        )

        raw_response = response.choices[0].message.content.strip()
        cleaned_json = self._clean_json_response(raw_response)

        return json.loads(cleaned_json)

    def _clean_json_response(self, text: str) -> str:
        """Strip markdown and extra text to extract ONLY the JSON block."""
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
        if match:
            return match.group(1).strip()
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match:
            return match.group(1).strip()
        return text.strip()
