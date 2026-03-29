"""
LaTeX Generator Module (Production Refactor)
Renders structured Resume JSON into .tex source using the Jinja2 template.
"""
import os
import re
from jinja2 import Environment, FileSystemLoader
from typing import Dict, Any

class LaTeXGenerator:
    def __init__(self, template_dir: str = "templates", template_name: str = "resume.tex.j2"):
        self.env = Environment(
            block_start_string='<%',
            block_end_string='%>',
            variable_start_string='<<',
            variable_end_string='>>',
            comment_start_string='<#',
            comment_end_string='#>',
            loader=FileSystemLoader(template_dir)
        )
        self.template = self.env.get_template(template_name)

    def generate(self, resume_json: Dict[str, Any]) -> str:
        """Render JSON into LaTeX source code with recursive escaping."""
        # 0. Normalize 'skills' key (handle AI hallucinations)
        if "skills" not in resume_json:
            for alt_key in ["technical_skills", "skills_and_technologies", "technologies"]:
                if alt_key in resume_json:
                    resume_json["skills"] = resume_json.pop(alt_key)
                    break
        
        # Ensure 'skills' is a dict with expected keys or at least doesn't crash
        if "skills" in resume_json:
            if not isinstance(resume_json["skills"], dict):
                # If skills came as a flat list, move it to 'other'
                resume_json["skills"] = {"other": resume_json["skills"]}
            
            # Ensure sub-keys are lists
            for sub_key in ["languages", "frameworks", "tools", "other"]:
                val = resume_json["skills"].get(sub_key, [])
                if isinstance(val, str):
                    resume_json["skills"][sub_key] = [s.strip() for s in val.split(",")]
                elif not isinstance(val, list):
                    resume_json["skills"][sub_key] = []
        
        # 1. Clean the deep JSON data (recursive escape)
        escaped_data = self._escape_latex_recursive(resume_json)
        
        # 2. Smart Social Links Selection (Max 4)
        # Priority: Email, LinkedIn, GitHub, LeetCode, Portfolio, Phone
        potential_links = [
            ("email", resume_json.get("email"), "envelope", resume_json.get("email")),
            ("linkedin", resume_json.get("linkedin"), "linkedin", "LinkedIn"),
            ("github", resume_json.get("github"), "github", "GitHub"),
            ("leetcode", resume_json.get("leetcode"), "code", "LeetCode"),
            ("portfolio", resume_json.get("portfolio"), "globe", "Portfolio"),
            ("phone", resume_json.get("phone"), "phone", resume_json.get("phone")),
            ("twitter", resume_json.get("twitter"), "twitter", "Twitter"),
            ("medium", resume_json.get("medium"), "medium", "Medium"),
            ("kaggle", resume_json.get("kaggle"), "kaggle", "Kaggle")
        ]
        
        active_links = []
        for l_info in potential_links:
            l_type = l_info[0]
            l_val = l_info[1]
            l_icon = l_info[2]
            
            if l_val and str(l_val).strip() and l_val != "None":
                clean_val = str(l_val).strip()
                # Default display is the value itself for email/phone, or the label for socials
                display = str(l_info[3]) if len(l_info) > 3 and l_info[3] else clean_val
                
                # Protocol logic
                if l_type in ["email", "phone"]:
                    # Stripping prefixes because template adds mailto: and tel:
                    clean_val = re.sub(r"^(mailto:|tel:)", "", clean_val, flags=re.IGNORECASE)
                else:
                    # Web links: Ensure exactly one https://
                    clean_val = re.sub(r"^(https?://)+", "", clean_val, flags=re.IGNORECASE)
                    clean_val = "https://" + clean_val
                
                active_links.append({
                    "type": l_type, 
                    "value": clean_val, 
                    "icon": l_icon, 
                    "display": self._escape_latex_string(display)
                })
        
        escaped_data["header_links"] = active_links[:4]
        
        # 3. Render Template
        return self.template.render(**escaped_data)

    def _escape_latex_recursive(self, data: Any) -> Any:
        """Recursively escape special LaTeX characters in the JSON values."""
        if isinstance(data, dict):
            return {k: self._escape_latex_recursive(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._escape_latex_recursive(v) for v in data]
        elif isinstance(data, str):
            return self._escape_latex_string(data)
        return data

    def _escape_latex_string(self, text: str) -> str:
        """Escape special LaTeX characters in a string, avoiding double-escaping."""
        if not isinstance(text, str):
            return str(text)
        
        # 1. Unescape common entities if AI provided them escaped
        # (e.g. \& -> &) so we can unify our escaping logic.
        text = text.replace(r'\&', '&').replace(r'\%', '%').replace(r'\$', '$')
        text = text.replace(r'\_', '_').replace(r'\{', '{').replace(r'\}', '}')
        
        # 2. Perform standard escapes
        replacements = [
            ("\\", r"\textbackslash{}"),
            ("&", r"\&"),
            ("%", r"\%"),
            ("$", r"\$"),
            ("#", r"\#"),
            ("_", r"\_"),
            ("{", r"\{"),
            ("}", r"\}"),
            ("~", r"\textasciitilde{}"),
            ("^", r"\textasciicircum{}"),
        ]
        for char, escaped in replacements:
            if char == "\\":
                # Special handling for backslash to avoid recursive death
                text = text.replace(char, escaped)
            else:
                text = text.replace(char, escaped)
        return text
