#!/usr/bin/env python3
"""
Test script to verify imports work correctly
"""

try:
    print("Testing FastAPI import...")
    from fastapi import FastAPI
    print("OK - FastAPI imported successfully")

    print("Testing database import...")
    from database import engine, Base
    print("OK - Database imported successfully")

    print("Testing routes import...")
    from routes import auth, links, analytics
    print("OK - All routes imported successfully")

    print("Testing main app creation...")
    app = FastAPI(title="LinkSutra Test", version="1.0.0")
    print("OK - FastAPI app created successfully")

    print("\nSUCCESS - All imports work!")

except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    import sys
    print(f"Python path: {sys.path}")

except Exception as e:
    print(f"OTHER ERROR: {e}")
    import traceback
    traceback.print_exc()