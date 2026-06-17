@echo off
title VMF Holidays — Startup
color 0B

echo.
echo  ==========================================
echo   VMF Holidays -- Starting dev server...
echo  ==========================================
echo.

:: Check if Windows Terminal is available
where wt >nul 2>&1
if %errorlevel% == 0 (
    echo  Opening in Windows Terminal...
    wt --title "VMF Holidays" new-tab --title "Dev Server" powershell -NoExit -Command "npm run dev"
    goto done
)

:: Fallback: single PowerShell window
start "VMF -- Dev Server (keep open)" powershell -NoExit -Command "npm run dev"

:done
echo.
echo  ==========================================
echo   Dev server starting:
echo.
echo   Website:  http://localhost:3000
echo   Admin:    http://localhost:3000/admin/login
echo  ==========================================
echo.
pause
