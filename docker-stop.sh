#!/bin/bash

# Docker Stop Script for Mac/Linux

echo ""
echo "🛑 Stopping Wealth Holding Docker Containers"
echo "==========================================="
echo ""

docker-compose down

if [ $? -ne 0 ]; then
    echo "❌ Failed to stop containers"
    exit 1
fi

echo ""
echo "✅ All containers stopped"
echo ""
echo "To completely remove database (start fresh):"
echo "   docker-compose down -v"
echo ""
