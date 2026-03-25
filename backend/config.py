"""
Configuration management for LinkSutra API
Centralizes environment variable handling and app constants
"""
import os
from typing import List

class Config:
    """Application configuration constants and environment variable handling"""

    # Environment detection
    def is_production() -> bool:
        """Check if running in production environment"""
        return os.getenv("RENDER") is not None or os.getenv("NODE_ENV") == "production"

    # Database configuration
    def get_database_url() -> str:
        """Get database URL with fallback to SQLite for development"""
        return os.getenv("DATABASE_URL", "sqlite:///./linksutra.db")

    def is_postgresql_url(url: str) -> bool:
        """Check if database URL is PostgreSQL"""
        return url.startswith(("postgresql://", "postgres://"))

    # Security configuration
    def get_secret_key() -> str:
        """Get secret key for JWT token generation"""
        secret = os.getenv("SECRET_KEY")
        if not secret:
            if Config.is_production():
                raise ValueError("SECRET_KEY environment variable must be set in production")
            return "linksutra-dev-secret-change-in-production"
        return secret

    # CORS configuration
    def get_cors_origins() -> List[str]:
        """Parse and validate CORS origins from environment"""
        origins_env = os.getenv("CORS_ORIGINS", "")

        # Production default - restrict to frontend domain
        if Config.is_production() and not origins_env:
            frontend_url = os.getenv("FRONTEND_URL")
            return [frontend_url] if frontend_url else ["https://your-frontend-domain.onrender.com"]

        # Development defaults
        if not origins_env or origins_env == "*":
            return ["http://localhost:3000", "http://127.0.0.1:3000"]

        # Parse comma-separated origins
        return [origin.strip() for origin in origins_env.split(",") if origin.strip()]

    # Application settings
    APP_NAME = "LinkSutra"
    APP_DESCRIPTION = "Privacy-first link-in-bio platform"
    VERSION = "1.0.0"

    # Health check settings
    HEALTH_CHECK_DB_TIMEOUT = 2  # seconds