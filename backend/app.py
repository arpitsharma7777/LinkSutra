"""
Alternative entry point for Railway deployment
This ensures Railway can import the FastAPI app reliably
"""
import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Now import the FastAPI app from main
try:
    from main import app
    print(f"Successfully imported FastAPI app from main.py")
    print(f"Working directory: {os.getcwd()}")
    print(f"Backend directory: {backend_dir}")
except ImportError as e:
    print(f"Failed to import app from main: {e}")
    print(f"Python path: {sys.path}")
    print(f"Files in directory: {os.listdir('.')}")
    raise

# Export the app for uvicorn
__all__ = ['app']