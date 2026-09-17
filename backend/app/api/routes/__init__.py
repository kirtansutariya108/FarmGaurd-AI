from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.profile import router as profile_router
from app.api.routes.farms import router as farms_router
from app.api.routes.disease import router as disease_router
from app.api.routes.irrigation import router as irrigation_router
from app.api.routes.weather import router as weather_router
from app.api.routes.health import router as health_router
from app.api.routes.recommendations import router as recommendations_router
from app.api.routes.history import router as history_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.system import router as system_router
from app.api.routes.intelligence import router as intelligence_router

api_router = APIRouter()

api_router.include_router(system_router)
api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(farms_router)
api_router.include_router(disease_router)
api_router.include_router(irrigation_router)
api_router.include_router(weather_router)
api_router.include_router(health_router)
api_router.include_router(recommendations_router)
api_router.include_router(history_router)
api_router.include_router(notifications_router)
api_router.include_router(dashboard_router)
api_router.include_router(intelligence_router)

