"""
Simple entry point for Railway
Tries multiple import strategies to ensure the FastAPI app loads
"""
import os
import sys

def main():
    print("=== Railway LinkSutra Startup ===")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print(f"Python path: {sys.path}")

    # Strategy 1: Try to change to backend directory
    backend_paths = ['backend', './backend', '/app/backend']
    backend_dir = None

    for path in backend_paths:
        if os.path.exists(path) and os.path.isdir(path):
            print(f"Found backend directory at: {path}")
            backend_dir = path
            break

    if backend_dir:
        print(f"Changing to backend directory: {backend_dir}")
        os.chdir(backend_dir)
        if backend_dir not in sys.path:
            sys.path.insert(0, os.path.abspath(backend_dir))
    else:
        print("Backend directory not found, trying current directory")

    # Strategy 2: Add current directory to path
    current_dir = os.getcwd()
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    print(f"Updated working directory: {os.getcwd()}")
    print(f"Files in directory: {os.listdir('.')}")
    print(f"Updated Python path: {sys.path}")

    # Strategy 3: Try importing the app
    app = None
    import_strategies = [
        ('app', 'app'),
        ('main', 'app'),
        ('backend.app', 'app'),
        ('backend.main', 'app'),
    ]

    for module_name, app_name in import_strategies:
        try:
            print(f"Trying to import {app_name} from {module_name}...")
            module = __import__(module_name, fromlist=[app_name])
            app = getattr(module, app_name)
            print(f"SUCCESS: Imported {app_name} from {module_name}")
            break
        except ImportError as e:
            print(f"Failed to import {app_name} from {module_name}: {e}")
        except AttributeError as e:
            print(f"Module {module_name} found but no {app_name} attribute: {e}")

    if not app:
        print("ERROR: Could not import FastAPI app using any strategy")
        sys.exit(1)

    # Strategy 4: Start uvicorn
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    print(f"Starting uvicorn on port {port}")

    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()