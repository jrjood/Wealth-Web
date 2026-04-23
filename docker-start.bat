@echo off
REM Docker Quick Start Script for Windows

echo.
echo 🐳 Wealth Holding Premium Realty - Docker Setup
echo ================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Check if .env files exist (optional for Docker)
if not exist ".env" (
    echo 📝 Creating frontend .env file...
    echo VITE_API_URL=http://localhost:3001 > .env
)

if not exist "server\.env" (
    echo 📝 Creating backend .env file...
    echo PORT=3001 > server\.env
    echo DATABASE_URL=mysql://wealth_user:wealth_password@db:3306/wealth_holding >> server\.env
)

echo 🏗️  Building and starting containers...
echo This may take a few minutes on first run...
echo.

docker-compose up -d --build

if errorlevel 1 (
    echo.
    echo ❌ Failed to start containers
    echo.
    echo Try running: docker-compose logs
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo ✅ All services started successfully!
echo.
echo 📋 Access Points:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:3001
echo    Admin:     http://localhost:5173/admin/login
echo.
echo 🔐 Admin Credentials:
echo    Email:     admin@wealthholding.com
echo    Password:  changeme123
echo.
echo 📊 Useful Commands:
echo    View logs:     docker-compose logs -f
echo    Stop all:      docker-compose down
echo    Restart:       docker-compose restart
echo.
echo Opening browser...
timeout /t 2 /nobreak > nul
start http://localhost:5173
echo.
pause
