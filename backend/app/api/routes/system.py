from fastapi import APIRouter
from app.core.config import settings
from app.ml.disease.model_loader import disease_model_manager
from app.ml.irrigation.model_loader import irrigation_model_manager

router = APIRouter(tags=["System Health"])


@router.get("/health")
def system_health_check():
    """Service health and readiness verification."""
    return {
        "status": "ok",
        "service": "FarmGuard AI backend",
        "environment": settings.APP_ENV,
        "demo_mode": settings.DEMO_MODE,
        "ml": {
            "disease_model_loaded": disease_model_manager.is_loaded,
            "disease_labels_count": len(disease_model_manager.labels),
            "irrigation_model_loaded": irrigation_model_manager.is_loaded
        }
    }
