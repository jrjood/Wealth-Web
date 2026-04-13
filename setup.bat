@echo off
REM Wealth Holding - Quick Setup Script for Windows

echo.
echo 🏢 Wealth Holding Premium Realty - Database Setup
echo ==================================================
echo.

REM Check if .env exists in server
if not exist "server\.env" (
    echo ⚠️  No .env file found in server directory
    echo 📝 Creating .env from .env.example...
    copy server\.env.example server\.env
    echo ✅ Created server\.env - Please edit it with your database credentials
    echo.
    pause
)

REM Check if .env exists in root
if not exist ".env" (
    echo 📝 Creating frontend .env from .env.example...
    copy .env.example .env
    echo ✅ Created .env for frontend
    echo.
)

REM Backend setup
echo 📦 Installing backend dependencies...
cd server
call npm install

echo.
echo 🔄 Generating Prisma Client...
call npx prisma generate

echo.
echo 🗄️  Setting up database...
call npx prisma db push

echo.
echo 🌱 Seeding database with initial data...
call npm run seed

echo.
echo ✅ Backend setup complete!
echo.

REM Return to root and setup frontend
cd ..
echo 📦 Installing frontend dependencies...
call npm install

echo.
echo ✨ Setup complete!
echo.
echo 📋 Next steps:
echo    1. Start backend:  cd server ^&^& npm run dev
echo    2. Start frontend: npm run dev
echo    3. Access admin:   http://localhost:5173/admin/login
echo.
echo 🔐 Default admin credentials:
echo    Email:    admin@wealthholding.com
echo    Password: changeme123
echo.
echo ⚠️  Remember to change the admin password after first login!
echo.
pause
