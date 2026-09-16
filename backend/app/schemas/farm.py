from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

GrowthStageType = Literal["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"]
SoilTypeType = Literal["Loamy", "Clay", "Sandy", "Silty", "Black Soil", "Other"]
DiseaseRiskType = Literal["Low", "Moderate", "High"]


class CoordinatesSchema(BaseModel):
    lat: float
    lng: float


class FarmBase(BaseModel):
    name: str = Field(..., min_length=2)
    location: str
    areaAcres: float = Field(2.5, serialization_alias="areaAcres")
    crop: str = "Tomato"
    cropVariety: str = Field("Standard Hybrid", serialization_alias="cropVariety")
    soilType: SoilTypeType = Field("Loamy", serialization_alias="soilType")
    growthStage: GrowthStageType = Field("Flowering", serialization_alias="growthStage")
    coordinates: Optional[CoordinatesSchema] = None

    model_config = ConfigDict(populate_by_name=True)


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    areaAcres: Optional[float] = None
    crop: Optional[str] = None
    cropVariety: Optional[str] = None
    soilType: Optional[SoilTypeType] = None
    growthStage: Optional[GrowthStageType] = None
    soilMoisture: Optional[float] = None
    lastIrrigationDaysAgo: Optional[int] = None
    healthScore: Optional[int] = None
    diseaseRisk: Optional[DiseaseRiskType] = None
    coordinates: Optional[CoordinatesSchema] = None

    model_config = ConfigDict(populate_by_name=True)


class FarmResponse(FarmBase):
    id: str
    healthScore: int = Field(80, serialization_alias="healthScore")
    soilMoisture: float = Field(35.0, serialization_alias="soilMoisture")
    lastIrrigationDaysAgo: int = Field(2, serialization_alias="lastIrrigationDaysAgo")
    lastScanDate: str = Field("Today", serialization_alias="lastScanDate")
    diseaseRisk: DiseaseRiskType = Field("Low", serialization_alias="diseaseRisk")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
