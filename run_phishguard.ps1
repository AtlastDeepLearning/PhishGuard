# PhishGuard Startup Script

$PROJECT_ROOT = "g:\Documents\Coding Portfolio\CYBERSECURITY\phishguard"
$VENV_ACTIVATE = "$PROJECT_ROOT\.venv\Scripts\Activate.ps1"
$NPM_PATH = "C:\Program Files\nodejs\npm.cmd"

# Start Backend
# We need to activate the venv first, then run uvicorn
$BackendCommand = "cd '$PROJECT_ROOT'; & '$VENV_ACTIVATE'; uvicorn backend.ingest_service.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand

# Start Frontend
# We use the absolute path to npm to be safe
$FrontendCommand = "cd '$PROJECT_ROOT\frontend\dashboard'; & '$NPM_PATH' run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCommand

Write-Host "PhishGuard services starting..."
Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: http://localhost:5173 (usually)"
