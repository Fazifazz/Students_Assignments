@echo off
echo Starting EquipTrack Backend on port 5001...
start cmd /k "cd /d %~dp0backend && node server.js"

echo Starting EquipTrack Frontend on port 5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo Both services launched! Opening browser...
timeout /t 3 >nul
start http://localhost:5173
