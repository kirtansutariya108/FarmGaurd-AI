from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

NotificationCategoryType = Literal["scanner", "weather", "irrigation", "system"]


class FarmNotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    category: NotificationCategoryType
    isRead: bool = Field(..., serialization_alias="isRead")
    timestamp: str
    linkUrl: Optional[str] = Field(None, serialization_alias="linkUrl")

    model_config = ConfigDict(populate_by_name=True)


class NotificationUpdate(BaseModel):
    isRead: bool = Field(True, serialization_alias="isRead")
