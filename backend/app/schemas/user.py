from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.schemas.auth import UserProfileResponse


class UserUpdateRequest(BaseModel):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    preferredLanguage: Optional[Literal["en", "hi", "gu"]] = None
    theme: Optional[Literal["light", "dark", "system"]] = None
    units: Optional[Literal["metric", "imperial"]] = None
    notificationsEnabled: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)
