@echo off
title VMF Holidays — Startup
color 0B

echo.
echo  ==========================================
echo   VMF Holidays -- Starting services...
echo  ==========================================
echo.

:: Check if Windows Terminal is available
where wt >nul 2>&1
if %errorlevel% == 0 (
    echo  Opening in Windows Terminal...
    wt --title "VMF Holidays" new-tab --title "Database" powershell -NoExit -Command "npx prisma dev" ; new-tab --title "Dev Server" powershell -NoExit -Command "Write-Host 'Waiting for database...' -ForegroundColor Cyan; while (-not (Test-NetConnection -ComputerName 127.0.0.1 -Port 51214 -InformationLevel Quiet -WarningAction SilentlyContinue)) { Start-Sleep 1 }; Write-Host 'Database ready!' -ForegroundColor Green; npm run dev"
    goto done
)

:: Fallback: separate PowerShell windows
echo  [1/2] Starting Prisma database...
start "VMF -- Database (keep open)" powershell -NoExit -Command "npx prisma dev"

echo  Waiting for database on port 51214...
:wait
powershell -Command "exit [int]!(Test-NetConnection -ComputerName 127.0.0.1 -Port 51214 -InformationLevel Quiet -WarningAction SilentlyContinue)" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto wait
)

echo  Database ready.
echo  [2/2] Starting Next.js dev server...
start "VMF -- Dev Server (keep open)" powershell -NoExit -Command "npm run dev"

:done
echo.
echo  ==========================================
echo   All services running:
echo.
echo   Website:  http://localhost:3000
echo   Admin:    http://localhost:3000/admin/login
echo   DB port:  127.0.0.1:51214
echo  ==========================================
echo.
pause
