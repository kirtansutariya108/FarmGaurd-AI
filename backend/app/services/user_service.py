from sqlalchemy.orm import Session
from app.db.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserProfileResponse
from app.schemas.user import UserUpdateRequest
from app.core.exceptions import EntityNotFoundException


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def get_profile(self, user_id: str) -> UserProfileResponse:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise EntityNotFoundException("User", user_id)
        resp = UserProfileResponse.model_validate(user)
        resp.createdAt = user.created_at.strftime("%Y-%m-%d")
        return resp

    def update_profile(self, user_id: str, updates: UserUpdateRequest) -> UserProfileResponse:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise EntityNotFoundException("User", user_id)

        if updates.fullName is not None:
            user.full_name = updates.fullName
        if updates.email is not None:
            user.email = updates.email.lower().strip()
        if updates.phone is not None:
            user.phone = updates.phone.strip()
        if updates.location is not None:
            user.location = updates.location
        if updates.preferredLanguage is not None:
            user.preferred_language = updates.preferredLanguage
        if updates.theme is not None:
            user.theme = updates.theme
        if updates.units is not None:
            user.units = updates.units
        if updates.notificationsEnabled is not None:
            user.notifications_enabled = updates.notificationsEnabled

        updated_user = self.user_repo.update(user)
        resp = UserProfileResponse.model_validate(updated_user)
        resp.createdAt = updated_user.created_at.strftime("%Y-%m-%d")
        return resp
