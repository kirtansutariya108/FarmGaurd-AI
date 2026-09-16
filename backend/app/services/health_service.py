from sqlalchemy.orm import Session
from app.repositories.farm_repository import FarmRepository
from app.repositories.scan_repository import ScanRepository
from app.schemas.health import CropHealthResponse
from app.decision_engine.crop_health import calculate_crop_health
from app.core.exceptions import EntityNotFoundException, ForbiddenException


class HealthService:
    def __init__(self, db: Session):
        self.db = db
        self.farm_repo = FarmRepository(db)
        self.scan_repo = ScanRepository(db)

    def get_crop_health(self, user_id: str, farm_id: str) -> CropHealthResponse:
        farm = self.farm_repo.get_by_id(farm_id)
        if not farm:
            raise EntityNotFoundException("Farm", farm_id)
        if farm.user_id != user_id:
            raise ForbiddenException("You do not have permission to view health data for this farm.")

        crop_name = farm.crops[0].crop_name if farm.crops else "Tomato"
        growth_stage = farm.crops[0].growth_stage if farm.crops else "Flowering"
        latest_cond = self.farm_repo.get_latest_condition(farm.id)
        latest_scan = self.scan_repo.get_latest_farm_scan(farm.id)

        soil_moisture = latest_cond.soil_moisture if latest_cond else 35.0
        temperature = latest_cond.temperature if (latest_cond and latest_cond.temperature) else 28.0
        rain_probability = latest_cond.rain_probability if (latest_cond and latest_cond.rain_probability) else 30.0

        latest_condition = latest_scan.primary_condition if latest_scan else None
        latest_confidence = latest_scan.confidence if latest_scan else None
        is_disease = latest_scan.status in ["Needs Attention", "Critical"] if latest_scan else False

        return calculate_crop_health(
            crop_name=crop_name,
            farm_name=farm.name,
            soil_moisture=soil_moisture,
            latest_scan_condition=latest_condition,
            latest_scan_confidence=latest_confidence,
            is_disease_detected=is_disease,
            rain_probability=rain_probability,
            temperature=temperature,
            growth_stage=growth_stage
        )
