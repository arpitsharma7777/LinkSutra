from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm

from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate
from dependencies import get_current_user,SECRET_KEY, ALGORITHM

# ─── CONFIG ──────────────────────────────────────────────────────────────────
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        display_name=user_data.display_name or user_data.username
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user by username (OAuth standard)
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update only provided fields
    if user_update.display_name is not None:
        current_user.display_name = user_update.display_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.avatar_url is not None:
        current_user.avatar_url = user_update.avatar_url

    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/export/profile")
def export_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export complete user profile including all links and analytics."""
    from models import Link, AnalyticsEvent

    # Calculate total clicks for user
    total_clicks = db.query(func.sum(Link.click_count)).filter(
        Link.user_id == current_user.id
    ).scalar() or 0

    # Get all links
    links = db.query(Link).filter(Link.user_id == current_user.id).all()

    return {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "display_name": current_user.display_name,
            "bio": current_user.bio,
            "email": current_user.email,
            "avatar_url": current_user.avatar_url,
            "created_at": current_user.created_at.isoformat()
        },
        "links": [
            {
                "id": link.id,
                "title": link.title,
                "url": link.url,
                "icon": link.icon,
                "is_active": link.is_active,
                "order_index": link.order_index,
                "click_count": link.click_count,
                "created_at": link.created_at.isoformat()
            }
            for link in links
        ],
        "analytics": {
            "total_clicks": total_clicks,
            "total_links": len(links),
            "active_links": sum(1 for link in links if link.is_active)
        },
        "exported_at": datetime.now(timezone.utc).isoformat()
    }