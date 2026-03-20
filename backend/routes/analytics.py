from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from database import get_db
from models import Link, AnalyticsEvent
from dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ─── PER LINK SUMMARY ────────────────────────────────────────────────────────

@router.get("/links")
def link_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    results = (
        db.query(
            Link.id.label("link_id"),
            Link.title,
            Link.url,
            func.count(AnalyticsEvent.id).label("click_count")
        )
        .outerjoin(AnalyticsEvent, AnalyticsEvent.link_id == Link.id)
        .filter(Link.user_id == current_user.id)
        .group_by(Link.id)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .all()
    )

    return [
        {
            "link_id": r.link_id,
            "title": r.title,
            "url": r.url,
            "click_count": r.click_count
        }
        for r in results
    ]


# ─── TOTAL CLICKS ─────────────────────────────────────────────────────────────

@router.get("/total-clicks")
def total_clicks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    total = (
        db.query(func.count(AnalyticsEvent.id))
        .join(Link, Link.id == AnalyticsEvent.link_id)
        .filter(Link.user_id == current_user.id)
        .scalar()
    )
    return {"total_clicks": total or 0}


# ─── DAILY CLICKS ─────────────────────────────────────────────────────────────

@router.get("/daily")
def daily_clicks(
    days: int = Query(default=7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    since = date.today() - timedelta(days=days)

    results = (
        db.query(
            func.date(AnalyticsEvent.clicked_at).label("date"),
            func.count(AnalyticsEvent.id).label("clicks")
        )
        .join(Link, Link.id == AnalyticsEvent.link_id)
        .filter(
            Link.user_id == current_user.id,
            AnalyticsEvent.clicked_at >= since
        )
        .group_by(func.date(AnalyticsEvent.clicked_at))
        .order_by(func.date(AnalyticsEvent.clicked_at))
        .all()
    )

    return [{"date": str(r.date), "clicks": r.clicks} for r in results]


# ─── TOP LINK ─────────────────────────────────────────────────────────────────

@router.get("/top-link")
def top_link(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = (
        db.query(
            Link.id,
            Link.title,
            Link.url,
            func.count(AnalyticsEvent.id).label("click_count")
        )
        .outerjoin(AnalyticsEvent, AnalyticsEvent.link_id == Link.id)
        .filter(Link.user_id == current_user.id)
        .group_by(Link.id)
        .order_by(func.count(AnalyticsEvent.id).desc())
        .first()
    )

    if not result:
        return {"message": "No links found"}

    return {
        "link_id": result.id,
        "title": result.title,
        "url": result.url,
        "click_count": result.click_count
    }