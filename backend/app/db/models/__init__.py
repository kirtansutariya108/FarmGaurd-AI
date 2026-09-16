from app.db.base import Base
from app.db.models.user import User
from app.db.models.farm import Farm, FarmCrop, CropCondition
from app.db.models.scan import CropScan, DiseasePrediction
from app.db.models.irrigation import IrrigationRecommendation
from app.db.models.weather import WeatherSnapshot
from app.db.models.recommendation import Recommendation
from app.db.models.notification import Notification

__all__ = [
    "Base",
    "User",
    "Farm",
    "FarmCrop",
    "CropCondition",
    "CropScan",
    "DiseasePrediction",
    "IrrigationRecommendation",
    "WeatherSnapshot",
    "Recommendation",
    "Notification",
]
