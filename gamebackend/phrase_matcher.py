"""Fuzzy phrase matching for voice commands."""
from rapidfuzz import fuzz


def match_phrase(transcript: str, accepted_variants: list[str]) -> dict:
    """Match a transcript against accepted phrase variants using fuzzy matching.
    
    Args:
        transcript: The transcribed text from Whisper.
        accepted_variants: List of acceptable phrase variations.
    
    Returns:
        Dict with matched (bool), transcript, best_match, and confidence.
    """
    transcript_clean = transcript.lower().strip()
    # Remove common punctuation
    for char in [".", ",", "!", "?", "'", '"']:
        transcript_clean = transcript_clean.replace(char, "")
    
    best_score = 0
    best_match = ""
    
    for variant in accepted_variants:
        score = fuzz.partial_ratio(transcript_clean, variant)
        token_score = fuzz.token_sort_ratio(transcript_clean, variant)
        combined = max(score, token_score)
        if combined > best_score:
            best_score = combined
            best_match = variant
    
    matched = best_score >= 70  # 70% fuzzy match threshold
    
    return {
        "matched": matched,
        "transcript": transcript_clean,
        "best_match": best_match,
        "confidence": best_score,
    }
