def apply_policy(analysis_result):
    score = analysis_result.get("score", 0.0)
    verdict = analysis_result.get("verdict", "clean")
    
    if verdict == "phishing":
        return "block"
    elif verdict == "suspicious":
        return "quarantine"
    else:
        return "allow"
