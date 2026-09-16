from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class UserProfileResponse(BaseModel):
    id: str
    fullName: str = Field(..., serialization_alias="fullName", validation_alias="full_name")
    email: str
    phone: str
    location: str
    avatarUrl: Optional[str] = Field(None, serialization_alias="avatarUrl")
    preferredLanguage: Literal["en", "hi", "gu"] = Field("en", serialization_alias="preferredLanguage", validation_alias="preferred_language")
    theme: Literal["light", "dark", "system"] = "light"
    units: Literal["metric", "imperial"] = "metric"
    notificationsEnabled: bool = Field(True, serialization_alias="notificationsEnabled", validation_alias="notifications_enabled")
    createdAt: Optional[str] = Field(None, serialization_alias="createdAt", validation_alias="created_at")

    @field_validator("createdAt", mode="before")
    @classmethod
    def serialize_created_at(cls, v):
        if isinstance(v, datetime):
            return v.strftime("%Y-%m-%d")
        return str(v) if v else ""

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)



class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email address or phone number")
    password: str = Field(..., min_length=6)


class SignUpRequest(BaseModel):
    fullName: str = Field(..., min_length=2)
    email: EmailStr
    phone: str = Field(..., min_length=10)
    password: str = Field(..., min_length=6)
    location: str = "Gujarat, India"
    farmName: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
    model_config = ConfigDict(populate_by_name=True)


class TokenRefreshRequest(BaseModel):
    refresh_token: Optional[str] = None
