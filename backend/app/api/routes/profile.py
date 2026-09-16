from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.auth import UserProfileResponse
from app.schemas.user import UserUpdateRequest
from app.schemas.common import ApiResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/profile", tags=["Profile & Settings"])


@router.get("", response_model=ApiResponse[UserProfileResponse])
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve full user profile and settings."""
    service = UserService(db)
    profile = service.get_profile(current_user.id)
    return ApiResponse(data=profile)


@router.put("", response_model=ApiResponse[UserProfileResponse])
def update_profile(
    updates: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user personal details or application settings."""
    service = UserService(db)
    updated = service.update_profile(current_user.id, updates)
    return ApiResponse(data=updated, message="Profile updated successfully.")
