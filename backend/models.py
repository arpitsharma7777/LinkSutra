from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    username     = Column(String, unique=True, index=True, nullable=False)
    email        = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    bio          = Column(Text, nullable=True)
    avatar_url   = Column(String, nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)

    # Relationship — User ke saare links
    links = relationship("Link", back_populates="owner", cascade="all, delete")


class Link(Base):
    __tablename__ = "links"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    title       = Column(String, nullable=False)
    url         = Column(String, nullable=False)
    icon        = Column(String, nullable=True)
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
    ip_hash    = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)

    link = relationship("Link", back_populates="analytics")