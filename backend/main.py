import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth
from routes import links
from routes import analytics

Base.metadata.create_all(bind=engine)

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
    return {"status": "healthy", "service": "LinkSutra API"}