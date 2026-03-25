#!/usr/bin/env python3
"""
Test script to verify imports work correctly
"""

try:
    print("Testing FastAPI import...")
    from fastapi import FastAPI
    print("✓ FastAPI imported successfully")

    print("Testing database import...")
    from database import engine, Base
    print("✓ Database imported successfully")

    print("Testing routes import...")
    from routes import auth, links, analytics
    print("✓ All routes imported successfully")

    print("Testing main app creation...")
    app = FastAPI(title="LinkSutra Test", version="1.0.0")
    print("✓ FastAPI app created successfully")

    print("\n✅ All imports successful! The app should work.")

except ImportError as e:
    print(f"❌ Import error: {e}")
    import sys
    print(f"Python path: {sys.path}")

except Exception as e:
    print(f"❌ Other error: {e}")
    import traceback
    traceback.print_exc()