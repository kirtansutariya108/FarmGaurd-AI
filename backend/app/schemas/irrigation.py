from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict

IrrigationStatusType = Literal["Recommended", "Monitor", "Not Needed", "Insufficient Data"]
PriorityType = Literal["High", "Medium", "Low"]


class FieldSignals(BaseModel):
    crop: str = "Tomato"
    growthStage: str = Field("Flowering", serialization_alias="growthStage")
    soilMoisture: Optional[float] = Field(None, serialization_alias="soilMoisture")
    temperature: float = 28.0
    humidity: float = 72.0
    rainProbability: float = Field(30.0, serialization_alias="rainProbability")
    lastIrrigationDaysAgo: Optional[int] = Field(None, serialization_alias="lastIrrigationDaysAgo")

    model_config = ConfigDict(populate_by_name=True)


class IrrigationRecommendationResponse(BaseModel):
    status: IrrigationStatusType
    priority: PriorityType
    headline: str
    summary: str
    reasons: List[str]
    actionAdvice: str = Field(..., serialization_alias="actionAdvice")
    fieldSignals: FieldSignals = Field(..., serialization_alias="fieldSignals")
    generatedAt: str = Field("Just now", serialization_alias="generatedAt")

    model_config = ConfigDict(populate_by_name=True)


class UpdateFieldConditionsRequest(BaseModel):
    farmId: Optional[str] = None
    soilMoisture: float = Field(..., ge=0, le=100)
    lastIrrigationDaysAgo: int = Field(..., ge=0)
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    rainProbability: Optional[float] = None

    model_config = ConfigDict(populate_by_name=True)
