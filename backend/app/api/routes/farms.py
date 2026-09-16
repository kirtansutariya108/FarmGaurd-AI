from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.schemas.common import ApiResponse
from app.services.farm_service import FarmService

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.get("", response_model=ApiResponse[List[FarmResponse]])
def list_farms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all registered farms belonging to the authenticated farmer."""
    service = FarmService(db)
    farms = service.get_user_farms(current_user.id)
    return ApiResponse(data=farms)


@router.post("", response_model=ApiResponse[FarmResponse], status_code=status.HTTP_201_CREATED)
def create_farm(
    data: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register a new farm plot or parcel."""
    service = FarmService(db)
    farm = service.create_farm(current_user.id, data)
    return ApiResponse(data=farm, message="Farm registered successfully.")


@router.get("/{farm_id}", response_model=ApiResponse[FarmResponse])
def get_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch complete details, crop metrics, and telemetry for a specific farm parcel."""
    service = FarmService(db)
    farm = service.get_farm_by_id(current_user.id, farm_id)
    return ApiResponse(data=farm)


@router.put("/{farm_id}", response_model=ApiResponse[FarmResponse])
def update_farm(
    farm_id: str,
    updates: FarmUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update farm attributes, crop growth stage, or soil moisture values."""
    service = FarmService(db)
    farm = service.update_farm(current_user.id, farm_id, updates)
    return ApiResponse(data=farm, message="Farm configuration updated.")


@router.delete("/{farm_id}", response_model=ApiResponse[dict])
def delete_farm(
    farm_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a registered farm parcel."""
    service = FarmService(db)
    service.delete_farm(current_user.id, farm_id)
    return ApiResponse(data={"success": True}, message="Farm parcel deleted.")
