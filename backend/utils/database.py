<<<<<<< HEAD
"""
Database utilities for LinkSutra API
Handles health checks and database operations efficiently
"""
from sqlalchemy.exc import SQLAlchemyError
from database import SessionLocal
import logging

logger = logging.getLogger(__name__)

class DatabaseHealth:
    """Manages database health checking without performance impact"""

    _last_check_result = True
    _check_counter = 0

    @classmethod
    def quick_health_check(cls) -> tuple[bool, str]:
        """
        Returns cached health status to avoid DB queries on every health check.
        Only performs actual DB test every 10th call to reduce overhead.
        """
        cls._check_counter += 1

        # Only actually test DB connection occasionally
        if cls._check_counter % 10 == 0:
            cls._last_check_result, message = cls._perform_db_test()
            return cls._last_check_result, message

        # Return cached result most of the time
        return cls._last_check_result, "connected" if cls._last_check_result else "disconnected"

    @classmethod
    def _perform_db_test(cls) -> tuple[bool, str]:
        """Actually test database connectivity"""
        try:
            # Use context manager for proper cleanup
            db = SessionLocal()
            try:
                db.execute("SELECT 1")
                return True, "connected"
            finally:
                db.close()

        except SQLAlchemyError as e:
            logger.warning(f"Database health check failed: {e}")
            return False, "disconnected"
        except Exception as e:
            logger.error(f"Unexpected health check error: {e}")
            return False, "error"

def get_database_connection_info() -> dict:
    """Get database connection information for debugging"""
    from config import Config
    db_url = Config.get_database_url()

    return {
        "type": "postgresql" if Config.is_postgresql_url(db_url) else "sqlite",
        "url_truncated": db_url[:20] + "..." if len(db_url) > 20 else db_url
=======
"""
Database utilities for LinkSutra API
Handles health checks and database operations efficiently
"""
from sqlalchemy.exc import SQLAlchemyError
from database import SessionLocal
import logging

logger = logging.getLogger(__name__)

class DatabaseHealth:
    """Manages database health checking without performance impact"""

    _last_check_result = True
    _check_counter = 0

    @classmethod
    def quick_health_check(cls) -> tuple[bool, str]:
        """
        Returns cached health status to avoid DB queries on every health check.
        Only performs actual DB test every 10th call to reduce overhead.
        """
        cls._check_counter += 1

        # Only actually test DB connection occasionally
        if cls._check_counter % 10 == 0:
            cls._last_check_result, message = cls._perform_db_test()
            return cls._last_check_result, message

        # Return cached result most of the time
        return cls._last_check_result, "connected" if cls._last_check_result else "disconnected"

    @classmethod
    def _perform_db_test(cls) -> tuple[bool, str]:
        """Actually test database connectivity"""
        try:
            # Use context manager for proper cleanup
            db = SessionLocal()
            try:
                db.execute("SELECT 1")
                return True, "connected"
            finally:
                db.close()

        except SQLAlchemyError as e:
            logger.warning(f"Database health check failed: {e}")
            return False, "disconnected"
        except Exception as e:
            logger.error(f"Unexpected health check error: {e}")
            return False, "error"

def get_database_connection_info() -> dict:
    """Get database connection information for debugging"""
    from config import Config
    db_url = Config.get_database_url()

    return {
        "type": "postgresql" if Config.is_postgresql_url(db_url) else "sqlite",
        "url_truncated": db_url[:20] + "..." if len(db_url) > 20 else db_url
>>>>>>> origin/divyanshi
    }