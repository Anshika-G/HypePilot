@echo off
cd /d "%~dp0"
set "HYPEPILOT_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 24 or newer is required. Install from https://nodejs.org
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<24)process.exit(1)"
if errorlevel 1 (
  echo Please upgrade Node.js to version 24 or newer.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:4317"
"%HYPEPILOT_NODE%" --env-file-if-exists=.env server.mjs
pause
