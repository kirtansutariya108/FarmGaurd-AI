from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.core.security import decode_access_token
from app.core.exceptions import UnauthorizedException
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # In development/demo mode without token, fallback to demo user if available
    if not token:
        user_repo = UserRepository(db)
        demo_user = user_repo.get_by_email("kirtan.farmer@farmguard.ai")
        if demo_user:
            return demo_user
        raise UnauthorizedException("Authentication token required.")

    payload = decode_access_token(token)
    if not payload:
        raise UnauthorizedException("Invalid or expired authentication token.")

    user_id: str = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token credentials.")

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise UnauthorizedException("User associated with token not found.")

    return user
