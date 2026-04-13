@echo off
echo Setting up MySQL database for Wealth Holding Premium Realty...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo.
    echo Or configure MySQL manually and update the DATABASE_URL in server\.env
    pause
    exit /b 1
)

echo Starting MySQL container...
docker run -d --name wealth-holding-mysql ^
  -e MYSQL_ROOT_PASSWORD=dev_password ^
  -e MYSQL_DATABASE=wealth_holding ^
  -e MYSQL_USER=wealth_admin ^
  -e MYSQL_PASSWORD=dev_password123 ^
  -p 3306:3306 ^
  mysql:8

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ MySQL container started successfully!
    echo.
    echo Please update your server\.env file with:
    echo DATABASE_URL="mysql://wealth_admin:dev_password123@localhost:3306/wealth_holding"
    echo.
    echo Waiting for MySQL to be ready...
    timeout /t 10 /nobreak >nul
    echo.
    echo Now run: npm run db:push
    echo Then run: npm run dev
) else (
    echo.
    echo Failed to start MySQL container. It may already exist.
    echo Try: docker start wealth-holding-mysql
    echo Or remove the old container: docker rm wealth-holding-mysql
)

pause
