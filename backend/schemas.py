from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── AUTH SCHEMAS ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── LINK SCHEMAS ─────────────────────────────────────────────────────────────

class LinkCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None

class LinkUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class LinkResponse(BaseModel):
    id: int
    title: str
    url: str
    icon: Optional[str]
    is_active: bool
    order_index: int
    click_count: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── PROFILE SCHEMA ───────────────────────────────────────────────────────────

class PublicProfile(BaseModel):
    username: str
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    links: List[LinkResponse]

    class Config:
        from_attributes = True


# ─── ANALYTICS SCHEMA ─────────────────────────────────────────────────────────

class AnalyticsSummary(BaseModel):
    link_id: int
    title: str
    url: str
    click_count: int