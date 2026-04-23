@echo off
REM Docker Stop Script for Windows

echo.
echo 🛑 Stopping Wealth Holding Docker Containers
echo ===========================================
echo.

docker-compose down

if errorlevel 1 (
    echo ❌ Failed to stop containers
    pause
    exit /b 1
)

echo.
echo ✅ All containers stopped
echo.
echo To completely remove database (start fresh):
echo    docker-compose down -v
echo.
pause
