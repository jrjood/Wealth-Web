#!/bin/bash

# Docker Rebuild Script - Use this if you encounter errors

echo ""
echo "🔄 Rebuilding Docker Containers"
echo "================================"
echo ""

echo "Stopping and removing containers..."
docker-compose down

echo ""
echo "Removing old images..."
docker-compose rm -f

echo ""
echo "Rebuilding containers (this may take a few minutes)..."
docker-compose build --no-cache

echo ""
echo "Starting fresh containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 15

echo ""
echo "📊 Checking service status..."
docker-compose ps

echo ""
echo "📋 View logs with: docker-compose logs -f"
echo ""
echo "✅ Rebuild complete!"
echo ""
echo "Access the application at:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3001"
echo "   Admin:     http://localhost:5173/admin/login"
echo ""
