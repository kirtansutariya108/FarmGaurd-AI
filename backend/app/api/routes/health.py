from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.health import CropHealthResponse
from app.schemas.common import ApiResponse
from app.services.health_service import HealthService

router = APIRouter(prefix="/health", tags=["Crop Health"])


@router.get("/{farm_id}", response_model=ApiResponse[CropHealthResponse])
def get_farm_crop_health(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve project-specific multi-factor composite health score, component metrics, and guidance.
    """
    service = HealthService(db)
    health = service.get_crop_health(current_user.id, farm_id)
    return ApiResponse(data=health)
