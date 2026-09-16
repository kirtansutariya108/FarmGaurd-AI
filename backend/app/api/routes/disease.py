from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.disease import DiseaseResultResponse, ImageQualityCheck
from app.schemas.common import ApiResponse
from app.services.disease_service import DiseaseService

router = APIRouter(prefix="/disease", tags=["Disease Scanner"])


@router.post("/validate", response_model=ApiResponse[ImageQualityCheck])
async def validate_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Validate image lighting, dimensions, blur, and leaf framing before heavy analysis."""
    contents = await file.read()
    service = DiseaseService(db)
    result = service.validate_image_quality(contents, file.content_type or "image/jpeg")
    return ApiResponse(data=result)


@router.post("/predict", response_model=ApiResponse[DiseaseResultResponse])
async def predict_leaf_disease(
    file: UploadFile = File(...),
    crop_name: str = Form("Tomato"),
    farm_id: Optional[str] = Form(None),
    scenario: str = Form("earlyBlight"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload and analyze crop leaf image for pathology detection.
    Executes MobileNetV2 model inference, top-k ranking, confidence filtering, and logs diagnostic findings.
    """
    contents = await file.read()
    service = DiseaseService(db)
    result = service.analyze_leaf_image(
        user_id=current_user.id,
        file_bytes=contents,
        content_type=file.content_type or "image/jpeg",
        crop_name=crop_name,
        farm_id=farm_id,
        demo_scenario=scenario
    )
    return ApiResponse(data=result, message="Leaf analysis completed successfully.")
