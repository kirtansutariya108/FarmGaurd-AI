from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict


class HealthMetricComponent(BaseModel):
    label: str
    score: int  # 0 - 100
    variant: Literal["emerald", "amber", "rose"]
    note: str


class CropHealthResponse(BaseModel):
    score: int  # 0 - 100
    status: Literal["Optimal", "Healthy-looking", "Needs Attention", "Critical"]
    cropName: str = Field(..., serialization_alias="cropName")
    farmName: str = Field(..., serialization_alias="farmName")
    summary: str
    metrics: List[HealthMetricComponent]
    methodologyNote: str = Field(
        "FarmGuard Health Indicator is a project-specific composite decision-support metric calculated from leaf pathology, soil moisture balance, and meteorological stress factors.",
        serialization_alias="methodologyNote"
    )

    model_config = ConfigDict(populate_by_name=True)
