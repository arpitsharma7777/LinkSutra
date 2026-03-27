"""
LinkSutra API - Main application entry point
Clean, optimized FastAPI application for Render deployment
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine, Base
from config import Config
from utils.database import DatabaseHealth, get_database_connection_info
from utils.logging import setup_logging, get_logger, sanitize_error
from routes import auth, links, analytics

# Set up logging
logger = setup_logging()
app_logger = get_logger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/hour"])

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""

    # Initialize database tables
    try:
        Base.metadata.create_all(bind=engine)
        app_logger.info("Database tables initialized successfully")
    except Exception as e:
        error_msg = sanitize_error(e)
        app_logger.error(f"Database initialization failed: {error_msg}")
        if Config.is_production():
            app_logger.warning("Continuing startup despite database error in production")
        else:
            app_logger.error("Database initialization required for development")
            raise

    # Create FastAPI app
    app = FastAPI(
        title=Config.APP_NAME,
        description=Config.APP_DESCRIPTION,
        version=Config.VERSION
    )
    
    # Add rate limiter to app state
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Configure CORS (computed once at startup)
    cors_origins = Config.get_cors_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )
    app_logger.info(f"CORS configured for origins: {cors_origins}")

    # Include routers
    app.include_router(auth.router)
    app.include_router(links.router)
    app.include_router(analytics.router)

    return app

# Create app instance
app = create_app()

@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "LinkSutra API is running 🔗",
        "version": Config.VERSION,
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """
    Optimized health check endpoint.
    Uses cached database status to avoid performance impact.
    """
    try:
        # Use efficient health check that doesn't hit DB every time
        db_healthy, db_status = DatabaseHealth.quick_health_check()

        health_data = {
            "status": "healthy" if db_healthy else "degraded",
            "service": Config.APP_NAME,
            "database": db_status,
            "version": Config.VERSION
        }

        # Add debug info in development
        if not Config.is_production():
            health_data["database_info"] = get_database_connection_info()

        return health_data

    except Exception as e:
        error_msg = sanitize_error(e)
        app_logger.error(f"Health check failed: {error_msg}")
        return {
            "status": "unhealthy",
            "service": Config.APP_NAME,
            "error": "Health check failed"
        }