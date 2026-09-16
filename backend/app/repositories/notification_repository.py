from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models.notification import Notification


class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, notif_id: str) -> Optional[Notification]:
        return self.db.query(Notification).filter(Notification.id == notif_id).first()

    def get_user_notifications(self, user_id: str) -> List[Notification]:
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(desc(Notification.created_at))
            .all()
        )

    def mark_all_as_read(self, user_id: str) -> None:
        self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({"is_read": True})
        self.db.commit()

    def create(self, notif: Notification) -> Notification:
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(notif)
        return notif

    def update(self, notif: Notification) -> Notification:
        self.db.commit()
        self.db.refresh(notif)
        return notif
