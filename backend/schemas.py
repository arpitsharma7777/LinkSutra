from pydantic import BaseModel, EmailStr, Field, AnyHttpUrl, field_validator
from typing import Optional, List
from datetime import datetime
import re


# ─── AUTH SCHEMAS ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$', description="Username must be 3-50 chars, alphanumeric with - and _")
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128, description="Password must be 8-128 characters")
    display_name: Optional[str] = Field(None, max_length=100, description="Max 100 characters")

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain alphanumeric characters, hyphens, and underscores')
        return v

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

class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, max_length=100, description="Max 100 characters")
    bio: Optional[str] = Field(None, max_length=500, description="Max 500 characters")
    avatar_url: Optional[str] = Field(None, description="Must be a valid HTTP(S) URL or local image Base64 data URI")

    @field_validator('avatar_url')
    @classmethod
    def validate_avatar_url(cls, v):
        if v is not None and v.strip() != "":
            val = v.strip()
            if val.startswith(('http://', 'https://')):
                return val
            if val.startswith('data:image/'):
                return val
            raise ValueError('Avatar URL must be a valid HTTP(S) URL or a local image Base64 data URI')
        return v

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── LINK SCHEMAS ─────────────────────────────────────────────────────────────

class LinkCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Link title, 1-200 characters")
    url: AnyHttpUrl = Field(..., description="Must be a valid HTTP(S) URL")
    icon: Optional[str] = Field(None, max_length=50, description="Icon identifier, max 50 characters")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()

class LinkUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Link title, 1-200 characters")
    url: Optional[AnyHttpUrl] = Field(None, description="Must be a valid HTTP(S) URL")
    icon: Optional[str] = Field(None, max_length=50, description="Icon identifier, max 50 characters")
    is_active: Optional[bool] = None
    order_index: Optional[int] = Field(None, ge=0, description="Must be non-negative")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError('Title cannot be empty or whitespace only')
            return v.strip()
        return v

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
    social_links: List[LinkResponse] = []
    action_buttons: List[LinkResponse] = []

    class Config:
        from_attributes = True


# ─── ANALYTICS SCHEMA ─────────────────────────────────────────────────────────

class AnalyticsSummary(BaseModel):
    link_id: int
    title: str
    url: str
    click_count: int