#!/bin/bash

echo "=== LinkSutra Railway Deployment Debug ==="
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

echo "Checking for backend directory..."
if [ -d "backend" ]; then
    echo "Backend directory found"
    cd backend
    echo "Changed to backend directory: $(pwd)"
    echo "Files in backend directory:"
    ls -la

    echo "Checking Python modules..."
    python -c "import sys; print('Python version:', sys.version)"
    python -c "import sys; print('Python path:', sys.path)"

    echo "Testing imports..."
    python -c "import fastapi; print('FastAPI available')" || echo "FastAPI not available"
    python -c "import main; print('main module available')" || echo "main module not available"
    python -c "import app; print('app module available')" || echo "app module not available"

    echo "Starting application..."
    exec python -m uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}

else
    echo "ERROR: Backend directory not found!"
    echo "Available directories:"
    ls -la
    exit 1
fi