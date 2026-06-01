"""
LinkSutra API - Main application entry point
Clean, optimized FastAPI application for Render deployment
"""
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

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
    
    # Add security middleware (order matters - HTTPS first)
    if Config.is_production():
        app.add_middleware(HTTPSRedirectMiddleware)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add GZip compression for faster responses
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Add security headers
    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response
    

    logger.info(f"CORS configured for origins: {cors_origins}")
    logger.info(f"Production mode: {Config.is_production()}")

    # Include routers
    app.include_router(auth.router)
    app.include_router(links.router)
    app.include_router(analytics.router)
    
    # Add exception handler for rate limiting
    from slowapi.errors import RateLimitExceeded
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exceeded_handler(request, exc):
        return {
            "error": "Rate limit exceeded",
            "detail": "Too many requests. Please try again later.",
            "status": 429
        }

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