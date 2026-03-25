import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth
from routes import links
from routes import analytics

# Initialize database with error handling
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
except Exception as e:
    print(f"Database initialization error: {e}")
    # Don't exit in production, let Railway handle restarts
    if os.getenv("RAILWAY_ENVIRONMENT"):
        print("Continuing despite database error in Railway environment")
    else:
        sys.exit(1)

app = FastAPI(title="LinkSutra API", version="1.0.0")

# Environment-aware CORS configuration
allow_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allow_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(links.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "LinkSutra API is running 🔗"}

@app.get("/health")
def health_check():
    """Health check endpoint with database connectivity test"""
    try:
        # Test database connection
        from database import SessionLocal
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()

        return {
            "status": "healthy",
            "service": "LinkSutra API",
            "database": "connected",
            "environment": os.getenv("RAILWAY_ENVIRONMENT", "development")
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "LinkSutra API",
            "database": "disconnected",
            "error": str(e),
            "environment": os.getenv("RAILWAY_ENVIRONMENT", "development")
        }