#!/bin/bash

# Wealth Holding - Quick Setup Script

echo "🏢 Wealth Holding Premium Realty - Database Setup"
echo "=================================================="
echo ""

# Check if .env exists in server
if [ ! -f "server/.env" ]; then
    echo "⚠️  No .env file found in server directory"
    echo "📝 Creating .env from .env.example..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env - Please edit it with your database credentials"
    echo ""
    read -p "Press enter to continue after editing server/.env..."
fi

# Check if .env exists in root
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env for frontend"
    echo ""
fi

# Backend setup
echo "📦 Installing backend dependencies..."
cd server
npm install

echo ""
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Setting up database..."
npx prisma db push

echo ""
echo "🌱 Seeding database with initial data..."
npm run seed

echo ""
echo "✅ Backend setup complete!"
echo ""

# Return to root and setup frontend
cd ..
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start backend:  cd server && npm run dev"
echo "   2. Start frontend: npm run dev"
echo "   3. Access admin:   http://localhost:5173/admin/login"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email:    admin@wealthholding.com"
echo "   Password: changeme123"
echo ""
echo "⚠️  Remember to change the admin password after first login!"
