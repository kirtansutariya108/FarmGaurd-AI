from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

RecommendationCategoryType = Literal["Disease", "Irrigation", "Weather", "Field Care", "General"]
RecommendationStatusType = Literal["Urgent", "Today", "Monitor", "Completed"]
RecommendationPriorityType = Literal["High", "Medium", "Low"]


class ActionableRecommendationResponse(BaseModel):
    id: str
    category: RecommendationCategoryType
    status: RecommendationStatusType
    title: str
    description: str
    actionText: str = Field(..., serialization_alias="actionText")
    actionLink: Optional[str] = Field(None, serialization_alias="actionLink")
    priority: RecommendationPriorityType
    farmId: str = Field(..., serialization_alias="farmId")
    farmName: str = Field(..., serialization_alias="farmName")
    crop: str
    createdAt: str = Field(..., serialization_alias="createdAt")
    completedAt: Optional[str] = Field(None, serialization_alias="completedAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class RecommendationStatusUpdate(BaseModel):
    status: RecommendationStatusType


class GenerateRecommendationsRequest(BaseModel):
    farmId: str
