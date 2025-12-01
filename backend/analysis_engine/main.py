import os
import joblib

MODEL_PATH = r'g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard\backend\models\phish_model_v1.joblib'

class AnalysisEngine:
    def __init__(self):
        print(f"Loading model from {MODEL_PATH}...")
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            print("Model not found! Using dummy.")
            self.model = None

    def analyze(self, text):
        if not self.model:
            return {"score": 0.0, "verdict": "unknown", "confidence": 0.0}
        
        # Predict probability
        proba = self.model.predict_proba([text])[0]
        score = proba[1] # Probability of class 1 (phishing)
        
        verdict = "clean"
        if score > 0.8:
            verdict = "phishing"
        elif score > 0.5:
            verdict = "suspicious"
            
        return {
            "score": float(score),
            "verdict": verdict,
            "confidence": float(max(proba))
        }

engine = AnalysisEngine()

def analyze_email(subject, body):
    text = (subject or "") + " " + (body or "")
    return engine.analyze(text)
