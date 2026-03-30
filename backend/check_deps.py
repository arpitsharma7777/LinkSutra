#!/usr/bin/env python3
"""
Simple dependency checker for LinkSutra backend
"""
import importlib

def check_dependencies():
    """Check if all required dependencies are available"""

    required_modules = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'bcrypt',
        'jose',
        'passlib',
        'pydantic',
        'email_validator',
        'python_multipart'
    ]

    missing = []
    available = []

    for module in required_modules:
        try:
            importlib.import_module(module)
            available.append(module)
        except ImportError:
            missing.append(module)

    print("=== Dependency Check ===")
    print(f"Available: {len(available)}")
    print(f"Missing: {len(missing)}")

    if missing:
        print("Missing modules:", missing)
        return False
    else:
        print("All dependencies available!")
        return True

if __name__ == "__main__":
    check_dependencies()