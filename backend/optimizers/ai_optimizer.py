"""
AI Optimizer Module (Production Refactor)
Handles content improvement for Resume JSON and RAW LaTeX (.tex) files via Groq.
"""
import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, Any, Optional, List

load_dotenv()

class AIOptimizer:
    def __init__(self):
        self.client = Groq()
        self.model = os.getenv("GROQ_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")
        self.system_prompt = """You are a world-class resume writer and career coach specializing in ATS optimization.

You will receive:
1. A candidate's resume in JSON format
2. A job description analysis in JSON format

Your task is to produce an IMPROVED version of the resume JSON with these specific improvements:

BULLET POINT IMPROVEMENTS (EXPERIENCE, PROJECTS, CO-CURRICULAR):
- SMART NARRATIVE MAPPING: Do not just append keywords. Instead, REPHRASE the user's existing work to highlight how it directly maps to the JD's requirements (e.g., if the JD mentions "Scalability" and the user mentioned "Handling 1M users", use terms like "Architected for high-concurrency scalability").
- CONTEXTUAL INTEGRATION: Weave in at least 2-3 JD technical keywords *into each bullet point* in a way that sounds genuine and authoritative.
- Start with a strong action verb (Led, Built, Designed, Reduced, Increased, Architected, Implemented, Optimized, Delivered, Automated, etc.)
- Quantify results wherever possible (e.g., "improved performance" → "improved API response time by 35%")

SKILLS SECTION & INTEGRATION:
- MANDATORY SCHEMA: You MUST return a 'skills' object with these EXACT keys: {"languages": [], "frameworks": [], "tools": [], "other": []}.
- DO NOT use any other key like 'technical_skills' or 'skills_and_technologies'.
- FULL PRESERVATION: Carry over 100% of the candidate's existing skills from the input JSON. Do NOT delete anything.
- SMART INCLUSION: Intelligently ADD every technical keyword from the JD into the most appropriate category.
- REORDERING: Place JD-required technical skills at the very beginning of each list.
- If a category is empty, return an empty array [] for that key.

SUMMARY:
- LENGTH: A concise, impactful 3-sentence statement (maximum 3 lines).
- DYNAMIC LOGIC:
    - If the user's resume ALREADY HAS a summary: Professionally rewrite it to align with the JD requirements and technical keywords.
    - If the user's resume HAS NO summary: Author a fresh, professional "human-version" summary based on the overall content of the resume.
- NO ROLE NAMES: Do NOT mention the exact Job Title or Role from the JD (e.g., avoid "Seeking a Data Engineer 2 role"). Focus on technical expertise.
- EXPERIENCE ENFORCEMENT:
    - Always state experience as at least "1+ years" or higher (e.g., "Experienced professional with 2+ years..."). Never use "0 years" or "entry-level".
    - If the JD specifically mentions an experience requirement (e.g., "3+ years"), integrate that specific number or higher into the narrative.
- INTEGRATION: Naturally weave in 5-6 top technical keywords from the JD.

ONE-PAGE ENFORCEMENT & QUALITY:
- DO NOT CONCISE OR SHORTEN: YOU MUST PRESERVE ALL ORIGINAL content from the user's resume. Do NOT reduce the number of bullets or omit any items.
- REWRITE FOR ATS: Professionally REWRITE content to align 100% with the JD keywords and requirements while keeping the original length and detail.
- LAYOUT: Achieve a single-page layout through professional LaTeX formatting and efficient wording. 
- SECTION ORDER: 1. Summary, 2. Education, 3. Technical Skills, 4. Projects, 5. Achievements/Certifications.
- NO EXPERIENCE: DO NOT include an 'experience' or 'work' section. Focus entirely on the sections listed above.

OPTIMIZATION GOAL:
- YOUR PRIMARY MISSION: 100% ATS Match + 1 Page Limit. Every single keyword provided in the JD analysis MUST exist in the final optimized resume JSON, but you MUST be extremely selective about which experiences you elaborate on to stay within the one-page limit. 
- INTEGRATION: Intelligently weave JD keywords and requirements into the most relevant slots. For example, if the JD requires "Advanced Python", and the user has 3 Python projects, focus the heavy detail on the one that best matches the JD's specific field (e.g. data engineering vs web dev).

STRUCTURE:
- Handle 'co_curricular' as a list of objects: {"name": "...", "role": "...", "tenure": "...", "bullets": ["..."]}

ABSOLUTE RULES — VIOLATIONS ARE NOT ACCEPTABLE:
- DO NOT return ANY LaTeX syntax, commands, or markdown outside the valid JSON.
- ALL VALUES in the JSON must be PLAIN TEXT ONLY. Our template handles the formatting.
- DO NOT invent companies, job titles, degrees, or dates.
- DO NOT add experience entries that don't exist in the original.
- Return ONLY valid JSON.
"""

    async def optimize(self, resume_json: Dict[str, Any], jd_json: Dict[str, Any], missing_keywords: Optional[List[str]] = None) -> Dict[str, Any]:
        """Return an AI-optimized version of resume_json using jd_json as guidance."""
        user_message = f"""CANDIDATE RESUME JSON:
{json.dumps(resume_json, indent=2)}

JOB DESCRIPTION ANALYSIS JSON:
{json.dumps(jd_json, indent=2)}
"""
        if missing_keywords:
            user_message += f"\n\nCRITICAL MISSING KEYWORDS (Target 100% Match):\nThe following keywords were missing from the original resume. You MUST integrate these into the new narrative:\n{', '.join(missing_keywords)}"
            
        user_message += "\n\nReturn the improved resume JSON now."

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
        )

        raw_response = response.choices[0].message.content.strip()
        cleaned_json = self._clean_json_response(raw_response)

        try:
            return json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            print(f"FAILED OPTIMIZE JSON: {cleaned_json}")
            raise ValueError(f"AI returned invalid optimized JSON: {str(e)}")

    def _clean_json_response(self, text: str) -> str:
        """Strip markdown and extra text to extract ONLY the JSON block."""
        # Remove any leading/trailing whitespace
        text = text.strip()
        
        # 1. Look for markdown code blocks
        match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
        if match:
            return match.group(1).strip()
            
        # 2. Look for the first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return text[start:end+1].strip()
            
        return text

    async def optimize_raw_tex(self, raw_tex: str, jd_json: Dict[str, Any]) -> str:
        """Take a raw LaTeX file and return an AI-optimized version of it."""
        prompt = f"""You are a LaTeX and Resume Expert. 
        You will receive:
        1. A resume in RAW LaTeX format.
        2. A job description analysis in JSON format.
        
        Your task:
        - Update the resume text content (summary, bullet points, skills) to match the JD requirements.
        - NATURAL SUMMARY: Ensure the summary is authentic and maximum 3 direct sentences.
        - LOGIC: Rewrite if existing, otherwise write a professional human-version based on the resume. 
        - FORBIDDEN: Do NOT mention the exact JD role title. 
        - EXPERIENCE: Always state as at least "1+ years" or match the JD's specific experience requirement if listed.
        - DO NOT ADD any new command definitions.
        - DO NOT MODIFY the preamble or any existing command definitions.
        - ONLY rewrite the text content inside the existing LaTeX environments.
        - DO NOT fabricate info.
        - Return the FULL modified LaTeX source code.
        
        JOB DESCRIPTION ANALYSIS:
        {json.dumps(jd_json, indent=2)}
        
        ORIGINAL LaTeX SOURCE:
        {raw_tex}
        
        Return only the modified LaTeX source code now."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a LaTeX expert. Return only code. Do not add headers or new command definitions."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=8192,
        )

        result = response.choices[0].message.content.strip()
        result = re.sub(r"^```(?:latex)?\n?", "", result)
        result = re.sub(r"\n?```$", "", result)
        return result
    async def refine_to_one_page(self, resume_json: Dict[str, Any], jd_json: Dict[str, Any]) -> Dict[str, Any]:
        """Surgically shorten a resume to fit on one page while preserving ATS keywords."""
        system_prompt = """You are a surgical resume editor. 
        Your ONLY goal is to remove High School (10th and 12th class) education entries from the resume.
        
        INSTRUCTIONS:
        1. Examine the "Education" section.
        2. Delete any entry that refers to 10th Grade, 12th Grade, Class X, Class XII, SSC, HSC, Secondary School, or equivalent High School education.
        3. DO NOT change anything else (projects, skills, experience, summary, etc.) - keep the content exactly as it is.
        4. If no such entries exist, return the JSON exactly as it is.
        
        Return ONLY the refined resume JSON."""
        
        user_message = f"""CURRENT OPTIMIZED RESUME JSON:
{json.dumps(resume_json, indent=2)}

JOB DESCRIPTION ANALYSIS:
{json.dumps(jd_json, indent=2)}

Please refine this to 1 page now."""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )

        raw_response = response.choices[0].message.content.strip()
        cleaned_json = self._clean_json_response(raw_response)

        try:
            return json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            print(f"FAILED REFINE JSON: {cleaned_json}")
            raise ValueError(f"AI returned invalid refined JSON: {str(e)}")
