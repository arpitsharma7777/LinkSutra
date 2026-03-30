"""
LinkSutra API - Main application entry point
Clean, optimized FastAPI application for Render deployment
"""
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import Config
from utils.database import DatabaseHealth, get_database_connection_info
from routes import auth, links, analytics

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""

    # Initialize database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        if Config.is_production():
            logger.warning("Continuing startup despite database error in production")
        else:
            logger.error("Database initialization required for development")
            raise

    # Create FastAPI app
    app = FastAPI(
        title=Config.APP_NAME,
        description=Config.APP_DESCRIPTION,
        version=Config.VERSION
    )

    # Configure CORS (computed once at startup)
    cors_origins = Config.get_cors_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"CORS configured for origins: {cors_origins}")

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
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "service": Config.APP_NAME,
            "error": "Health check failed"
        }