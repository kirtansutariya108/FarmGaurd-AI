from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.api.deps import get_current_user
from app.schemas.dashboard import DashboardResponse
from app.schemas.common import ApiResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=ApiResponse[DashboardResponse])
async def get_dashboard_summary(
    farm_id: Optional[str] = Query(None, alias="farm_id"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Unified Cockpit Aggregation Endpoint:
    Returns the selected farm, live agro-weather, composite health score,
    irrigation status, latest leaf scan, recent activity feed, and actionable tasks.
    """
    service = DashboardService(db)
    summary = await service.get_dashboard_summary(current_user.id, farm_id)
    return ApiResponse(data=summary)
