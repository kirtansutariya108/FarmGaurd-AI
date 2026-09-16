from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.farm import FarmResponse
from app.schemas.weather import WeatherDataResponse
from app.schemas.health import CropHealthResponse
from app.schemas.irrigation import IrrigationRecommendationResponse
from app.schemas.disease import DiseaseResultResponse
from app.schemas.history import ScanHistoryItemResponse
from app.schemas.recommendation import ActionableRecommendationResponse


class DashboardResponse(BaseModel):
    farm: Optional[FarmResponse] = None
    weather: Optional[WeatherDataResponse] = None
    cropHealth: Optional[CropHealthResponse] = Field(None, serialization_alias="cropHealth")
    irrigation: Optional[IrrigationRecommendationResponse] = None
    latestScan: Optional[DiseaseResultResponse] = Field(None, serialization_alias="latestScan")
    recentActivity: List[ScanHistoryItemResponse] = Field(default_factory=list, serialization_alias="recentActivity")
    recommendations: List[ActionableRecommendationResponse] = Field(default_factory=list)
    farmInsight: str = Field(..., serialization_alias="farmInsight")

    model_config = ConfigDict(populate_by_name=True)
