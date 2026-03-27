"""
Logging configuration for LinkSutra backend
Provides structured JSON logging for production and readable logging for development
"""
import logging
import sys
from pythonjsonlogger import jsonlogger
from config import Config


def setup_logging():
    """
    Configure application logging based on environment
    
    - Production: JSON structured logging to stdout
    - Development: Human-readable logging to stdout
    """
    logger = logging.getLogger()
    
    # Remove existing handlers
    logger.handlers = []
    
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    
    if Config.is_production():
        # Production: Structured JSON logging
        formatter = jsonlogger.JsonFormatter(
            fmt='%(asctime)s %(name)s %(levelname)s %(message)s',
            rename_fields={
                'asctime': 'timestamp',
                'name': 'logger',
                'levelname': 'level',
                'message': 'msg'
            }
        )
        handler.setFormatter(formatter)
        logger.setLevel(logging.INFO)
    else:
        # Development: Human-readable logging
        formatter = logging.Formatter(
            fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        logger.setLevel(logging.DEBUG)
    
    logger.addHandler(handler)
    
    # Set third-party loggers to WARNING to reduce noise
    logging.getLogger('uvicorn').setLevel(logging.WARNING)
    logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module
    
    Args:
        name: Module name (typically __name__)
    
    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)


# Safe logging helpers that sanitize sensitive data
def sanitize_error(error: Exception) -> str:
    """
    Sanitize error messages to avoid exposing sensitive information
    
    Args:
        error: Exception to sanitize
    
    Returns:
        Safe error message
    """
    error_type = type(error).__name__
    
    # In production, only return error type
    if Config.is_production():
        return error_type
    
    # In development, return full error
    return f"{error_type}: {str(error)}"
