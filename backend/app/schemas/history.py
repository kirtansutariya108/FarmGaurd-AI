from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

ScanStatusType = Literal["Needs Attention", "Healthy-looking", "Uncertain"]


class ScanHistoryItemResponse(BaseModel):
    id: str
    farmId: str = Field(..., serialization_alias="farmId")
    farmName: str = Field(..., serialization_alias="farmName")
    crop: str
    condition: str
    confidence: float
    status: ScanStatusType
    scanDate: str = Field(..., serialization_alias="scanDate")
    thumbnailUrl: str = Field(..., serialization_alias="thumbnailUrl")
    healthScoreContribution: int = Field(..., serialization_alias="healthScoreContribution")

    model_config = ConfigDict(populate_by_name=True)
