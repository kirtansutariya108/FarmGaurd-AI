from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.recommendation import (
    ActionableRecommendationResponse,
    RecommendationStatusUpdate,
    GenerateRecommendationsRequest
)
from app.schemas.common import ApiResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=ApiResponse[List[ActionableRecommendationResponse]])
def get_recommendations(
    farm_id: Optional[str] = Query(None, alias="farmId"),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List prioritized farm tasks generated from leaf pathology, moisture stress, and weather signals.
    """
    service = RecommendationService(db)
    recs = service.get_user_recommendations(current_user.id, farm_id, status)
    return ApiResponse(data=recs)


@router.patch("/{rec_id}/status", response_model=ApiResponse[ActionableRecommendationResponse])
def mark_recommendation_status(
    rec_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a recommendation task as completed."""
    service = RecommendationService(db)
    updated = service.mark_completed(current_user.id, rec_id)
    return ApiResponse(data=updated, message="Recommendation marked as completed.")
