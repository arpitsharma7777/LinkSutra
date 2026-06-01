from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import update, case
from typing import List
import hashlib
from database import get_db
from models import Link, User, AnalyticsEvent
from schemas import LinkCreate, LinkUpdate, LinkResponse, PublicProfile
from dependencies import get_current_user
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/links", tags=["links"])
limiter = Limiter(key_func=get_remote_address)

#---------Create Link-----------------------------------------------------------------

@router.post("", response_model=LinkResponse)
def create_link(
    link: LinkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_link = Link(
        title=link.title,
        url=str(link.url),
        icon=link.icon,
        is_active=True,
        order_index=(
    (db.query(Link)
     .filter(Link.user_id == current_user.id)
     .count())
),
        click_count=0,
        user_id=current_user.id
    )

    db.add(new_link)
    db.commit()
    db.refresh(new_link)

    return new_link
#----------Get My Links--------------------------------------------------------------------------
@router.get("", response_model=List[LinkResponse])
def get_my_links(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    links = (
        db.query(Link)
        .filter(Link.user_id == current_user.id)
        .order_by(Link.order_index)
        .all()
    )

    return links

#----------Reorder Links (Drag-Drop)-------------------------------------------------------------------------
@router.put("/reorder")
def reorder_links(
    order: list[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not order:
        return {"message": "Links reordered"}

    # Verify all links belong to current user
    link_count = db.query(Link).filter(
        Link.user_id == current_user.id,
        Link.id.in_(order)
    ).count()

    if link_count != len(order):
        raise HTTPException(status_code=400, detail="Invalid links provided")

    # Bulk update using CASE statement - single query instead of N queries
    stmt = update(Link).values(
        order_index=case(
            {link_id: idx for idx, link_id in enumerate(order)},
            value=Link.order_index
        )
    ).where(
        Link.user_id == current_user.id,
        Link.id.in_(order)
    )

    db.execute(stmt)
    db.commit()

    return {"message": "Links reordered"}

#--------Update Link---------------------------------------------------------------------------------

@router.put("/{link_id}", response_model=LinkResponse)
def update_link(
    link_id: int,
    link_update: LinkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    link = db.query(Link).filter(
        Link.id == link_id,
        Link.user_id == current_user.id
    ).first()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    if link_update.title is not None:
        link.title = link_update.title

    if link_update.url is not None:
        link.url = str(link_update.url)

    if link_update.icon is not None:
        link.icon = link_update.icon

    if link_update.is_active is not None:
        link.is_active = link_update.is_active

    if link_update.order_index is not None:
        link.order_index = link_update.order_index

    db.commit()
    db.refresh(link)

    return link

#----------Delete Link-------------------------------------------------------------------------------
@router.delete("/{link_id}")
def delete_link(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    link = db.query(Link).filter(
        Link.id == link_id,
        Link.user_id == current_user.id
    ).first()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    db.delete(link)
    db.commit()

    return {"message": "Link deleted"}

#--------Public Profile---------------------------------------------------------------------------------------------

@router.get("/profile/{username}", response_model=PublicProfile)
def public_profile(username: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    links = (
        db.query(Link)
        .filter(
            Link.user_id == user.id,
            Link.is_active == True
        )
        .order_by(Link.order_index)
        .all()
    )

    return {
        "username": user.username,
        "display_name": user.display_name,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "links": links
    }
    #-------Click Tracking + Redirect--------------------------------------------------------------------------------------------
  
@router.get("/{link_id}/click")
@limiter.limit("30/minute")
def track_click(
    link_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    link = db.query(Link).filter(Link.id == link_id).first()

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    # Get IP hash for analytics
    raw_ip = request.client.host or "unknown"
    ip_hash = hashlib.sha256(raw_ip.encode()).hexdigest()

    # Record analytics event
    event = AnalyticsEvent(
        link_id=link.id,
        ip_hash=ip_hash
    )
    db.add(event)

    # Atomically increment click count using SQL UPDATE (prevents lost updates on concurrent requests)
    db.execute(
        update(Link).where(Link.id == link_id).values(
            click_count=Link.click_count + 1
        )
    )

    db.commit()

    # Validate URL protocol to prevent open redirect attacks
    url_str = str(link.url)
    if not url_str.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="Invalid URL protocol")
    
    return RedirectResponse(url=url_str, status_code=302)