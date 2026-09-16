from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.history import ScanHistoryItemResponse
from app.schemas.disease import DiseaseResultResponse
from app.schemas.common import ApiResponse, PaginatedResponse
from app.repositories.scan_repository import ScanRepository
from app.services.disease_service import DiseaseService
from app.utils.pagination import paginate_list
from app.core.exceptions import EntityNotFoundException, ForbiddenException

router = APIRouter(prefix="/history", tags=["History Archive"])


@router.get("", response_model=PaginatedResponse[ScanHistoryItemResponse])
def get_scan_history(
    crop: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve paginated crop scan records with support for crop, status, and text search filters.
    """
    scan_repo = ScanRepository(db)
    scans = scan_repo.get_user_scans(current_user.id, crop, status, search)

    items: List[ScanHistoryItemResponse] = []
    for s in scans:
        farm_name = s.farm.name if s.farm else "General Plot"
        items.append(
            ScanHistoryItemResponse(
                id=s.id,
                farmId=s.farm_id or "farm-1",
                farmName=farm_name,
                crop=s.crop,
                condition=s.primary_condition,
                confidence=s.confidence,
                status=s.status,  # type: ignore
                scanDate=s.created_at.strftime("%b %d, %Y"),
                thumbnailUrl=s.image_url,
                healthScoreContribution=s.health_score_contribution
            )
        )

    paginated, meta = paginate_list(items, page, page_size)
    return PaginatedResponse(data=paginated, pagination=meta)


@router.get("/{scan_id}", response_model=ApiResponse[DiseaseResultResponse])
def get_scan_details(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch complete diagnostic findings, softmax predictions, and action steps for a specific scan."""
    service = DiseaseService(db)
    scan_resp = service.get_scan_by_id(current_user.id, scan_id)
    return ApiResponse(data=scan_resp)


@router.delete("/{scan_id}", response_model=ApiResponse[dict])
def delete_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a scan record from history."""
    scan_repo = ScanRepository(db)
    scan = scan_repo.get_by_id(scan_id)
    if not scan:
        raise EntityNotFoundException("CropScan", scan_id)
    if scan.user_id != current_user.id:
        raise ForbiddenException("You do not have permission to delete this scan.")

    scan_repo.delete(scan)
    return ApiResponse(data={"success": True}, message="Scan record removed.")
