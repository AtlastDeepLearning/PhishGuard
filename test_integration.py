import requests
import time
import subprocess
import sys
import os

def test_api():
    # Start the server
    print("Starting server...")
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.ingest_service.main:app", "--port", "8000"],
        cwd=r"g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        # Wait for server to start
        time.sleep(5)
        
        # Test 1: Clean email
        print("Testing clean email...")
        payload_clean = {
            "sender": "boss@company.com",
            "subject": "Meeting Agenda",
            "body": "Hi, let's meet at 2pm to discuss the project."
        }
        res = requests.post("http://127.0.0.1:8000/scan", json=payload_clean)
        print(f"Clean Response: {res.json()}")
        assert res.json()['action'] == 'allow'
        
        # Test 2: Phishing email (using a known phishing text from dataset or similar)
        print("Testing phishing email...")
        payload_phish = {
            "sender": "attacker@evil.com",
            "subject": "URGENT: Verify your account",
            "body": "Click here to verify your account immediately or it will be closed. http://evil.com/login"
        }
        res = requests.post("http://127.0.0.1:8000/scan", json=payload_phish)
        print(f"Phish Response: {res.json()}")
        # Depending on model, this should be block or quarantine
        
    except Exception as e:
        print(f"Test failed: {e}")
        # Print server output if failed
        outs, errs = proc.communicate(timeout=1)
        print(outs.decode())
        print(errs.decode())
    finally:
        print("Stopping server...")
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    test_api()
