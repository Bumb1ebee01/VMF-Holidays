@echo off
title VMF Holidays — Startup
color 0B

echo.
echo  ==========================================
echo   VMF Holidays — Starting services...
echo  ==========================================
echo.

echo  [1/2] Starting Prisma database...
start "VMF — Database (keep open)" cmd /k "npx prisma dev"

echo  Waiting for database on port 51214...
:wait
powershell -Command "exit [int]!(Test-NetConnection -ComputerName 127.0.0.1 -Port 51214 -InformationLevel Quiet -WarningAction SilentlyContinue)" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto wait
)

echo  Database ready.
echo.
echo  [2/2] Starting Next.js dev server...
start "VMF — Dev Server (keep open)" cmd /k "npm run dev"

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
