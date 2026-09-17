from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, ConfigDict


class FarmIntelligenceRequest(BaseModel):
    disease: str = Field(..., description="Diagnosed disease name or class key, e.g. late_blight or Late Blight")
    crop: Optional[str] = Field("Tomato", description="Crop type e.g. Tomato or Rice")
    confidence: float = Field(..., ge=0.0, le=100.0, description="Model prediction confidence percentage or score")
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
    crop: str = "Tomato"
    confidence: float
    severity: Literal["low", "moderate", "high"] = "moderate"
    summary: str = ""
    weatherRisk: Literal["LOW", "MODERATE", "HIGH", "UNAVAILABLE"] = "MODERATE"
    weatherAvailable: bool = True
    riskFactors: List[str] = Field(default_factory=list)
    immediateActions: List[str] = Field(default_factory=list)
    monitoringActions: List[str] = Field(default_factory=list)
    preventionActions: List[str] = Field(default_factory=list)
    weatherAdvice: List[str] = Field(default_factory=list)
    weatherSummary: Optional[WeatherSummary] = None
    disclaimer: str = (
        "This AI result is a decision-support indication based on the uploaded image "
        "and available environmental telemetry. Confirm uncertain symptoms with a qualified "
        "agricultural expert before applying crop protection products."
    )
    # Backwards compatibility fields
    riskLevel: str = "Moderate"
    advisory: str = ""
    actions: List[str] = Field(default_factory=list)
    weatherFactors: List[str] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True)


class FarmIntelligenceResponse(BaseModel):
    success: bool = True
    data: FarmIntelligenceData
    message: Optional[str] = None

