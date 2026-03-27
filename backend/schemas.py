from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator
from typing import Optional, List
from datetime import datetime
import re


# ─── AUTH SCHEMAS ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    display_name: Optional[str] = Field(None, max_length=100)
    
    @field_validator('username')
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_-]+$", v):
            raise ValueError('Username must contain only letters, numbers, underscores, and hyphens')
        return v.strip()

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
    display_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, max_length=2048)

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── LINK SCHEMAS ─────────────────────────────────────────────────────────────

class LinkCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    url: str = Field(..., max_length=2048)
    icon: Optional[str] = Field(None, max_length=500)
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        # Strip whitespace
        v = v.strip()
        # Ensure URL has a scheme
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        # Basic validation for allowed characters
        if any(char in v for char in ['<', '>', '"', '{', '}', '|', '\\', '^', '`']):
            raise ValueError('URL contains invalid characters')
        return v
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        return v.strip()

class LinkUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    url: Optional[str] = Field(None, max_length=2048)
    icon: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    order_index: Optional[int] = None
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Strip whitespace
        v = v.strip()
        # Ensure URL has a scheme
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        # Basic validation for allowed characters
        if any(char in v for char in ['<', '>', '"', '{', '}', '|', '\\', '^', '`']):
            raise ValueError('URL contains invalid characters')
        return v
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return v.strip()

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