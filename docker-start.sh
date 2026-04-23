#!/bin/bash

# Docker Quick Start Script for Mac/Linux

echo ""
echo "🐳 Wealth Holding Premium Realty - Docker Setup"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env files exist (optional for Docker)
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:3001" > .env
fi

if [ ! -f "server/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > server/.env << EOF
PORT=3001
DATABASE_URL=mysql://wealth_user:wealth_password@db:3306/wealth_holding
EOF
fi

echo "🏗️  Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to start containers"
    echo ""
    echo "Try running: docker-compose logs"
    exit 1
fi

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📋 Access Points:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3001"
echo "   Admin:     http://localhost:5173/admin/login"
echo ""
echo "🔐 Admin Credentials:"
echo "   Email:     admin@wealthholding.com"
echo "   Password:  changeme123"
echo ""
echo "📊 Useful Commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop all:      docker-compose down"
echo "   Restart:       docker-compose restart"
echo ""

# Try to open browser (Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Opening browser..."
    sleep 2
    open http://localhost:5173
fi

# Try to open browser (Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open > /dev/null; then
        echo "Opening browser..."
        sleep 2
        xdg-open http://localhost:5173
    fi
fi

echo ""
