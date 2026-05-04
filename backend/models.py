from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    username     = Column(String(50), unique=True, index=True, nullable=False)
    email        = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String(100), nullable=True)
    bio          = Column(String(500), nullable=True)
    avatar_url   = Column(String(2048), nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)

    # Relationship — User ke saare links
    links = relationship("Link", back_populates="owner", cascade="all, delete")


class Link(Base):
    __tablename__ = "links"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    title       = Column(String(200), nullable=False)
    url         = Column(String(2048), nullable=False)
    icon        = Column(String(50), nullable=True)
    is_active   = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)

    # Relationship — Link ka owner
    owner = relationship("User", back_populates="links")
    analytics = relationship("AnalyticsEvent", back_populates="link", cascade="all, delete")


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id         = Column(Integer, primary_key=True, index=True)
    link_id    = Column(Integer, ForeignKey("links.id"), nullable=False)
    clicked_at = Column(DateTime, default=datetime.utcnow)
    ip_hash    = Column(String(64), nullable=True)
    user_agent = Column(String(500), nullable=True)

    link = relationship("Link", back_populates="analytics")