from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.notification import FarmNotificationResponse
from app.schemas.common import ApiResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=ApiResponse[List[FarmNotificationResponse]])
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve farmer alerts and notifications feed."""
    service = NotificationService(db)
    notifs = service.get_notifications(current_user.id)
    return ApiResponse(data=notifs)


@router.patch("/{notif_id}/read", response_model=ApiResponse[FarmNotificationResponse])
def mark_notification_read(
    notif_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a single notification as read."""
    service = NotificationService(db)
    updated = service.mark_as_read(current_user.id, notif_id)
    return ApiResponse(data=updated)


@router.post("/mark-all-read", response_model=ApiResponse[dict])
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read for current user."""
    service = NotificationService(db)
    service.mark_all_as_read(current_user.id)
    return ApiResponse(data={"success": True}, message="All notifications marked as read.")
