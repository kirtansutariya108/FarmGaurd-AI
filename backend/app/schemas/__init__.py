from app.schemas.common import ApiResponse, PaginatedResponse, ErrorResponse, PaginationMeta
from app.schemas.auth import UserProfileResponse, LoginRequest, SignUpRequest, TokenResponse
from app.schemas.user import UserUpdateRequest
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.schemas.disease import DiseaseResultResponse, DiseasePredictionItem, ImageQualityCheck
from app.schemas.irrigation import IrrigationRecommendationResponse, UpdateFieldConditionsRequest
from app.schemas.weather import WeatherDataResponse, ForecastDay
from app.schemas.health import CropHealthResponse
from app.schemas.recommendation import ActionableRecommendationResponse, RecommendationStatusUpdate
from app.schemas.history import ScanHistoryItemResponse
from app.schemas.notification import FarmNotificationResponse, NotificationUpdate
from app.schemas.dashboard import DashboardResponse

__all__ = [
    "ApiResponse",
    "PaginatedResponse",
    "ErrorResponse",
    "PaginationMeta",
    "UserProfileResponse",
    "LoginRequest",
    "SignUpRequest",
    "TokenResponse",
    "UserUpdateRequest",
    "FarmCreate",
    "FarmUpdate",
    "FarmResponse",
    "DiseaseResultResponse",
    "DiseasePredictionItem",
    "ImageQualityCheck",
    "IrrigationRecommendationResponse",
    "UpdateFieldConditionsRequest",
    "WeatherDataResponse",
    "ForecastDay",
    "CropHealthResponse",
    "ActionableRecommendationResponse",
    "RecommendationStatusUpdate",
    "ScanHistoryItemResponse",
    "FarmNotificationResponse",
    "NotificationUpdate",
    "DashboardResponse",
]
