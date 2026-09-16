from typing import List
from sqlalchemy.orm import Session
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import FarmNotificationResponse
from app.utils.datetime import relative_time_string
from app.core.exceptions import EntityNotFoundException, ForbiddenException


class NotificationService:
    def __init__(self, db: Session):
        self.db = db
        self.notif_repo = NotificationRepository(db)

    def get_notifications(self, user_id: str) -> List[FarmNotificationResponse]:
        notifs = self.notif_repo.get_user_notifications(user_id)
        return [
            FarmNotificationResponse(
                id=n.id,
                title=n.title,
                message=n.message,
                category=n.category,  # type: ignore
                isRead=n.is_read,
                timestamp=relative_time_string(n.created_at),
                linkUrl=n.link_url
            )
            for n in notifs
        ]

    def mark_as_read(self, user_id: str, notif_id: str) -> FarmNotificationResponse:
        n = self.notif_repo.get_by_id(notif_id)
        if not n:
            raise EntityNotFoundException("Notification", notif_id)
        if n.user_id != user_id:
            raise ForbiddenException("You do not have permission to view this notification.")

        n.is_read = True
        updated = self.notif_repo.update(n)
        return FarmNotificationResponse(
            id=updated.id,
            title=updated.title,
            message=updated.message,
            category=updated.category,  # type: ignore
            isRead=updated.is_read,
            timestamp=relative_time_string(updated.created_at),
            linkUrl=updated.link_url
        )

    def mark_all_as_read(self, user_id: str) -> None:
        self.notif_repo.mark_all_as_read(user_id)
