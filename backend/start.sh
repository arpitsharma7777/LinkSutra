#!/bin/bash

# Ensure we're in the correct directory
cd /app

# Debug information
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

echo "Python path:"
python -c "import sys; print('\n'.join(sys.path))"

echo "Checking for main.py:"
ls -la main.* || echo "No main.py found!"

echo "Starting LinkSutra backend..."
echo "DATABASE_URL: ${DATABASE_URL:-not-set}"
echo "PORT: ${PORT:-8000}"

# Start the FastAPI application
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}