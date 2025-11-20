#!/bin/bash

# Database Setup Script for Brain Agriculture API
# This script helps set up the PostgreSQL database

set -e

echo "🌱 Brain Agriculture API - Database Setup"
echo "=========================================="
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your database credentials."
    echo ""
    read -p "Press Enter to continue after updating .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Database Configuration:"
echo "  Host: ${DB_HOST}"
echo "  Port: ${DB_PORT}"
echo "  Database: ${DB_DATABASE}"
echo "  Username: ${DB_USERNAME}"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! command -v psql &> /dev/null; then
    echo "❌ psql command not found. Please install PostgreSQL client."
    exit 1
fi

# Test connection
if PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -d postgres -c "SELECT 1" &> /dev/null; then
    echo "✅ PostgreSQL connection successful"
else
    echo "❌ Cannot connect to PostgreSQL. Please check your credentials."
    exit 1
fi

# Create database if it doesn't exist
echo ""
echo "Creating database if it doesn't exist..."
PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE}'" | grep -q 1 || \
PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -d postgres -c "CREATE DATABASE ${DB_DATABASE}"

echo "✅ Database '${DB_DATABASE}' ready"

# Enable UUID extension
echo ""
echo "Enabling UUID extension..."
PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USERNAME} -d ${DB_DATABASE} -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"" &> /dev/null
echo "✅ UUID extension enabled"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing Node.js dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Run migrations
echo ""
echo "Running database migrations..."
npm run migration:run

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:${PORT}/health to check API status"
echo "  3. Use the API endpoints documented in README.md"
echo ""
