from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ForecastDay(BaseModel):
    date: str
    dayName: str = Field(..., serialization_alias="dayName")
    tempMax: float = Field(..., serialization_alias="tempMax")
    tempMin: float = Field(..., serialization_alias="tempMin")
    condition: str
    rainProbability: float = Field(..., serialization_alias="rainProbability")
    humidity: float
    icon: str
    precipitationMm: float = Field(0.0, serialization_alias="precipitationMm")
    uvIndex: float = Field(0.0, serialization_alias="uvIndex")

    model_config = ConfigDict(populate_by_name=True)


class WeatherDataResponse(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    currentTemp: float = Field(..., serialization_alias="currentTemp")
    condition: str
    humidity: float
    rainProbability: float = Field(..., serialization_alias="rainProbability")
    windSpeedKmH: float = Field(..., serialization_alias="windSpeedKmH")
    uvIndex: float = Field(..., serialization_alias="uvIndex")
    soilTemp: float = Field(..., serialization_alias="soilTemp")
    precipitationMm: float = Field(0.0, serialization_alias="precipitationMm")
    forecast: List[ForecastDay]
    farmInsight: str = Field(..., serialization_alias="farmInsight")
    lastUpdated: str = Field("Just now", serialization_alias="lastUpdated")
    source: str = Field("open-meteo", serialization_alias="source")

    model_config = ConfigDict(populate_by_name=True)
