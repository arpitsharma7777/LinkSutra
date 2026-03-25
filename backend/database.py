from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import Config

# Get database configuration
DATABASE_URL = Config.get_database_url()

# Create engine with appropriate configuration
def create_database_engine(database_url: str):
    """Create database engine with appropriate configuration for database type"""
    if Config.is_postgresql_url(database_url):
        return create_engine(
            database_url,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True  # Verify connections before use
        )
    else:
        # SQLite configuration
        return create_engine(
            database_url,
            connect_args={"check_same_thread": False}
        )

engine = create_database_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
