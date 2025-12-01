from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

# Add parent dir to path to import sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analysis_engine.main import analyze_email
from policy_engine.main import apply_policy

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For MVP, allow all. In prod, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    sender: str
    subject: str
    body: str

@app.post("/scan")
def scan_email(email: EmailRequest):
    # 1. Analyze
    analysis_result = analyze_email(email.subject, email.body)
    
    # 2. Apply Policy
    action = apply_policy(analysis_result)
    
    return {
        "analysis": analysis_result,
        "action": action
    }

@app.get("/")
def read_root():
    return {"status": "running", "service": "PhishGuard Ingest"}
