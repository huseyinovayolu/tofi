#!/bin/bash

# Setup script for tofi.ch development environment
# This script automates the initial setup process

set -e

echo "🌸 Setting up tofi.ch development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_tool() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
    else
        echo -e "${RED}✗${NC} $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "Checking required tools..."
check_tool "node"
check_tool "pnpm"
check_tool "docker"
check_tool "docker-compose"
check_tool "git"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗${NC} Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
else
    echo -e "${GREEN}✓${NC} Node.js version is compatible: $(node --version)"
fi

# Check pnpm version
PNPM_VERSION=$(pnpm --version | cut -d'.' -f1)
if [ "$PNPM_VERSION" -lt 8 ]; then
    echo -e "${YELLOW}⚠${NC} pnpm version 8+ is recommended. Current version: $(pnpm --version)"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🐳 Starting development services..."
pnpm docker:dev

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
until docker exec tofi-postgres pg_isready -U tofi -d tofi_dev > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done
echo -e "${GREEN}✓${NC} PostgreSQL is ready"

# Check if Redis is ready
until docker exec tofi-redis redis-cli ping > /dev/null 2>&1; do
    echo "Waiting for Redis..."
    sleep 2
done
echo -e "${GREEN}✓${NC} Redis is ready"

echo ""
echo "🗄️ Setting up database..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠${NC} Please update .env.local with your configuration"
fi

# Generate Prisma client
echo "Generating Prisma client..."
pnpm db:generate

# Push database schema
echo "Setting up database schema..."
pnpm db:push

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "🚀 To start development:"
echo "   pnpm dev"
echo ""
echo "📚 Services available:"
echo "   • Customer App:              http://localhost:3000"
echo "   • PostgreSQL:                localhost:5432"
echo "   • Redis:                     localhost:6379"
echo "   • OpenSearch:                http://localhost:9200"
echo "   • OpenSearch Dashboards:     http://localhost:5601"
echo "   • MailHog (Email testing):   http://localhost:8025"
echo "   • MinIO (S3 storage):        http://localhost:9001"
echo "   • Prisma Studio:             http://localhost:5555"
echo ""
echo "📖 Documentation:"
echo "   • README.md for overview"
echo "   • DEVELOPMENT.md for detailed development guide"
echo ""
echo "Happy coding! 🇨🇭🌸"