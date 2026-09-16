from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email.lower().strip()).first()

    def get_by_phone(self, phone: str) -> Optional[User]:
        return self.db.query(User).filter(User.phone == phone.strip()).first()

    def get_by_identifier(self, identifier: str) -> Optional[User]:
        cleaned = identifier.strip()
        return self.db.query(User).filter(
            or_(User.email == cleaned.lower(), User.phone == cleaned)
        ).first()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user
