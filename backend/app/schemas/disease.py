from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict

DiseaseStatusType = Literal["Needs Attention", "Healthy-looking", "Uncertain", "Critical"]


class DiseasePredictionItem(BaseModel):
    diseaseName: str = Field(..., serialization_alias="diseaseName")
    confidence: float  # e.g. 91.0 (%)
    description: Optional[str] = None
    model_config = ConfigDict(populate_by_name=True)


class DiseaseResultResponse(BaseModel):
    id: str
    cropName: str = Field(..., serialization_alias="cropName")
    primaryCondition: str = Field(..., serialization_alias="primaryCondition")
    confidence: float
    status: DiseaseStatusType
    isLowConfidence: bool = Field(..., serialization_alias="isLowConfidence")
    isHealthy: bool = Field(..., serialization_alias="isHealthy")
    visualFindings: str = Field(..., serialization_alias="visualFindings")
    nextSteps: List[str] = Field(default_factory=list, serialization_alias="nextSteps")
    topPredictions: List[DiseasePredictionItem] = Field(default_factory=list, serialization_alias="topPredictions")
    scannedAt: str = Field(..., serialization_alias="scannedAt")
    imageUrl: str = Field(..., serialization_alias="imageUrl")
    farmId: Optional[str] = Field(None, serialization_alias="farmId")
    farmName: Optional[str] = Field(None, serialization_alias="farmName")
    model_version: Optional[str] = "mobilenetv2-v1.0.0"

    model_config = ConfigDict(populate_by_name=True)


class ImageQualityCheck(BaseModel):
    isValid: bool = Field(..., serialization_alias="isValid")
    lightingQuality: Literal["Good", "Fair", "Poor"] = Field(..., serialization_alias="lightingQuality")
    blurLevel: Literal["Low", "Moderate", "High"] = Field(..., serialization_alias="blurLevel")
    isLeafCentered: bool = Field(..., serialization_alias="isLeafCentered")
    notes: str

    model_config = ConfigDict(populate_by_name=True)


class PredictResponse(BaseModel):
    success: bool = True
    status: Literal["success", "low_confidence", "unsupported_image", "error"] = "success"
    crop: Optional[str] = None
    disease: Optional[str] = None
    class_name: Optional[str] = None
    confidence: float
    message: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

