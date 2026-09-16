from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.auth import LoginRequest, SignUpRequest, TokenResponse, UserProfileResponse, TokenRefreshRequest
from app.schemas.common import ApiResponse
from app.services.auth_service import AuthService
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=ApiResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
def register(data: SignUpRequest, db: Session = Depends(get_db)):
    """Register a new farmer account and initialize default farm parcel."""
    service = AuthService(db)
    token_resp = service.register(data)
    return ApiResponse(data=token_resp, message="Registration successful.")


@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email or phone number and password."""
    service = AuthService(db)
    token_resp = service.login(data)
    return ApiResponse(data=token_resp, message="Login successful.")


@router.get("/me", response_model=ApiResponse[UserProfileResponse])
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Fetch profile of currently authenticated farmer."""
    profile = UserProfileResponse.model_validate(current_user)
    profile.createdAt = current_user.created_at.strftime("%Y-%m-%d")
    return ApiResponse(data=profile)


@router.post("/refresh", response_model=ApiResponse[TokenResponse])
def refresh_token(current_user: User = Depends(get_current_user)):
    """Generate a refreshed access token."""
    access_token = create_access_token(subject=current_user.id)
    profile = UserProfileResponse.model_validate(current_user)
    profile.createdAt = current_user.created_at.strftime("%Y-%m-%d")
    return ApiResponse(
        data=TokenResponse(access_token=access_token, token_type="bearer", user=profile),
        message="Token refreshed."
    )


@router.post("/logout", response_model=ApiResponse[dict])
def logout(current_user: User = Depends(get_current_user)):
    """Log out authenticated user."""
    return ApiResponse(data={"success": True}, message="Successfully logged out.")
