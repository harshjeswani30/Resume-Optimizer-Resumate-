"""
Keyword Matcher Module (Production Refactor)
Calculates ATS match scores and generates detailed keyword reports.
"""
import re
from typing import Dict, Any, List

class KeywordMatcher:
    def calculate_match_score(self, resume_json: Dict[str, Any], jd_keywords: Dict[str, Any]) -> float:
        """Calculate ATS match score (0-100) based on keyword density and action verbs."""
        resume_text = self._flatten_resume_text(resume_json).lower()
        
        # 1. Technical Keywords Match
        tech_skills = list(set([s.lower() for s in jd_keywords.get("required_skills", []) + jd_keywords.get("keywords", [])]))
        if not tech_skills:
            return 0.0
            
        # Improved multi-word matching with word boundaries
        matched_tech = 0
        for skill in tech_skills:
            # Use raw string for regex; \b ensures we match only whole words
            # This prevents "C" from matching "Content"
            pattern = rf"\b{re.escape(skill)}\b"
            if re.search(pattern, resume_text, re.IGNORECASE):
                matched_tech += 1
                
        tech_score = (matched_tech / len(tech_skills)) * 100
        
        # 2. Action Verbs Match
        action_verbs = [v.lower() for v in jd_keywords.get("action_verbs", [])]
        if action_verbs:
            matched_verbs = sum(1 for verb in set(action_verbs) if verb in resume_text)
            verb_score = (matched_verbs / len(set(action_verbs))) * 100
        else:
            verb_score = 100 # Default if no verbs requested
            
        # Weighted Score (70% tech, 30% verbs)
        final_score = (tech_score * 0.7) + (verb_score * 0.3)
        return round(min(final_score, 100.0), 1)

    def generate_report(self, resume_json: Dict[str, Any], jd_keywords: Dict[str, Any]) -> Dict[str, Any]:
        """Identify matched and missing keywords for the user UI."""
        resume_text = self._flatten_resume_text(resume_json).lower()
        all_keywords = sorted(list(set([s.lower() for s in jd_keywords.get("required_skills", []) + jd_keywords.get("keywords", [])])))
        
        matched = []
        missing = []
        for kw in all_keywords:
            if re.search(re.escape(kw), resume_text):
                matched.append(kw)
            else:
                missing.append(kw)
        
        return {
            "matched_keywords": sorted(matched),
            "missing_keywords": sorted(missing),
            "match_rate": f"{len(matched)}/{len(all_keywords)}" if all_keywords else "0/0"
        }

    def _flatten_resume_text(self, resume_json: Dict[str, Any]) -> str:
        """Convert all JSON values into a single searchable string."""
        text_parts = []
        
        def extract_values(obj):
            if isinstance(obj, str):
                text_parts.append(obj)
            elif isinstance(obj, list):
                for item in obj:
                    extract_values(item)
            elif isinstance(obj, dict):
                for value in obj.values():
                    extract_values(value)
                    
        extract_values(resume_json)
        return " ".join(text_parts)
