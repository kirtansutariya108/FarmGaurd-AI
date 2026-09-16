from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.irrigation import (
    IrrigationRecommendationResponse,
    UpdateFieldConditionsRequest
)
from app.schemas.common import ApiResponse
from app.services.irrigation_service import IrrigationService

router = APIRouter(prefix="/irrigation", tags=["Irrigation Advisor"])


@router.post("/recommend", response_model=ApiResponse[IrrigationRecommendationResponse])
def get_irrigation_recommendation(
    farm_id: Optional[str] = Query(None, alias="farmId"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Synthesize multi-signal irrigation advice combining root zone dampness, crop stage, and weather forecast.
    """
    service = IrrigationService(db)
    rec = service.get_recommendation(farm_id)
    return ApiResponse(data=rec)


@router.put("/conditions", response_model=ApiResponse[IrrigationRecommendationResponse])
def update_field_conditions(
    data: UpdateFieldConditionsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Record updated field moisture or days since last watering and return recalibrated guidance.
    """
    service = IrrigationService(db)
    rec = service.update_field_conditions(data)
    return ApiResponse(data=rec, message="Field conditions updated and re-evaluated.")
