from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class FarmIntelligenceRequest(BaseModel):
    disease: str = Field(..., description="Diagnosed disease name or condition, e.g. Bacterial leaf blight")
    confidence: float = Field(..., ge=0.0, le=100.0, description="Model prediction confidence percentage")
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="Field latitude")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="Field longitude")
    city: Optional[str] = Field(None, description="City or village name for weather resolution")


class WeatherSummary(BaseModel):
    location: Optional[str] = None
    currentTemp: Optional[float] = None
    condition: Optional[str] = None
    humidity: Optional[float] = None
    rainProbability: Optional[float] = None
    windSpeedKmH: Optional[float] = None
    precipitationMm: Optional[float] = None
    soilTemp: Optional[float] = None
    uvIndex: Optional[float] = None


class FarmIntelligenceData(BaseModel):
    disease: str
    confidence: float
    riskLevel: str
    weatherRisk: str
    advisory: str
    actions: List[str]
    weatherFactors: List[str]
    weatherSummary: Optional[WeatherSummary] = None


class FarmIntelligenceResponse(BaseModel):
    success: bool = True
    data: FarmIntelligenceData
    message: Optional[str] = None
