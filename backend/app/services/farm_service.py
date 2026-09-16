from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models.farm import Farm, FarmCrop, CropCondition
from app.repositories.farm_repository import FarmRepository
from app.repositories.scan_repository import ScanRepository
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse, CoordinatesSchema
from app.decision_engine.crop_health import calculate_crop_health
from app.core.exceptions import EntityNotFoundException, ForbiddenException


class FarmService:
    def __init__(self, db: Session):
        self.db = db
        self.farm_repo = FarmRepository(db)
        self.scan_repo = ScanRepository(db)

    def _build_farm_response(self, farm: Farm) -> FarmResponse:
        crop_obj = farm.crops[0] if farm.crops else None
        cond_obj = self.farm_repo.get_latest_condition(farm.id)
        latest_scan = self.scan_repo.get_latest_farm_scan(farm.id)

        crop_name = crop_obj.crop_name if crop_obj else "Tomato"
        crop_variety = crop_obj.crop_variety if crop_obj else "Standard Hybrid"
        growth_stage = crop_obj.growth_stage if crop_obj else "Flowering"
        soil_moisture = cond_obj.soil_moisture if cond_obj else 35.0
        last_irrigation_days_ago = cond_obj.last_irrigation_days_ago if cond_obj else 2

        # Health Calculation
        health_calc = calculate_crop_health(
            crop_name=crop_name,
            farm_name=farm.name,
            soil_moisture=soil_moisture,
            latest_scan_condition=latest_scan.primary_condition if latest_scan else None,
            latest_scan_confidence=latest_scan.confidence if latest_scan else None,
            is_disease_detected=latest_scan.status in ["Needs Attention", "Critical"] if latest_scan else False
        )

        disease_risk = "Low"
        if latest_scan and latest_scan.status in ["Needs Attention", "Critical"]:
            disease_risk = "High" if latest_scan.confidence > 80 else "Moderate"

        last_scan_date = "Today"
        if latest_scan:
            last_scan_date = latest_scan.created_at.strftime("%b %d, %Y")

        coords = None
        if farm.latitude is not None and farm.longitude is not None:
            coords = CoordinatesSchema(lat=farm.latitude, lng=farm.longitude)

        return FarmResponse(
            id=farm.id,
            name=farm.name,
            location=farm.location,
            areaAcres=farm.area_acres,
            crop=crop_name,
            cropVariety=crop_variety,
            soilType=farm.soil_type,  # type: ignore
            growthStage=growth_stage,  # type: ignore
            healthScore=health_calc.score,
            soilMoisture=soil_moisture,
            lastIrrigationDaysAgo=last_irrigation_days_ago,
            lastScanDate=last_scan_date,
            diseaseRisk=disease_risk,  # type: ignore
            coordinates=coords
        )

    def get_user_farms(self, user_id: str) -> List[FarmResponse]:
        farms = self.farm_repo.get_by_user_id(user_id)
        return [self._build_farm_response(f) for f in farms]

    def get_farm_by_id(self, user_id: str, farm_id: str) -> FarmResponse:
        farm = self.farm_repo.get_by_id(farm_id)
        if not farm:
            raise EntityNotFoundException("Farm", farm_id)
        if farm.user_id != user_id:
            raise ForbiddenException("You do not have permission to view this farm.")
        return self._build_farm_response(farm)

    def create_farm(self, user_id: str, data: FarmCreate) -> FarmResponse:
        new_farm = Farm(
            user_id=user_id,
            name=data.name,
            location=data.location,
            area_acres=data.areaAcres,
            area_unit="Acres",
            soil_type=data.soilType,
            latitude=data.coordinates.lat if data.coordinates else None,
            longitude=data.coordinates.lng if data.coordinates else None
        )
        created_farm = self.farm_repo.create(new_farm)

        crop = FarmCrop(
            farm_id=created_farm.id,
            crop_name=data.crop,
            crop_variety=data.cropVariety,
            growth_stage=data.growthStage
        )
        self.db.add(crop)

        condition = CropCondition(
            farm_id=created_farm.id,
            soil_moisture=38.0,
            last_irrigation_days_ago=1
        )
        self.farm_repo.save_condition(condition)

        return self._build_farm_response(created_farm)

    def update_farm(self, user_id: str, farm_id: str, updates: FarmUpdate) -> FarmResponse:
        farm = self.farm_repo.get_by_id(farm_id)
        if not farm:
            raise EntityNotFoundException("Farm", farm_id)
        if farm.user_id != user_id:
            raise ForbiddenException("You do not have permission to modify this farm.")

        if updates.name is not None:
            farm.name = updates.name
        if updates.location is not None:
            farm.location = updates.location
        if updates.areaAcres is not None:
            farm.area_acres = updates.areaAcres
        if updates.soilType is not None:
            farm.soil_type = updates.soilType
        if updates.coordinates is not None:
            farm.latitude = updates.coordinates.lat
            farm.longitude = updates.coordinates.lng

        # Update crop if specified
        if updates.crop is not None or updates.cropVariety is not None or updates.growthStage is not None:
            if farm.crops:
                crop = farm.crops[0]
                if updates.crop is not None:
                    crop.crop_name = updates.crop
                if updates.cropVariety is not None:
                    crop.crop_variety = updates.cropVariety
                if updates.growthStage is not None:
                    crop.growth_stage = updates.growthStage
            else:
                crop = FarmCrop(
                    farm_id=farm.id,
                    crop_name=updates.crop or "Tomato",
                    crop_variety=updates.cropVariety or "Standard Hybrid",
                    growth_stage=updates.growthStage or "Flowering"
                )
                self.db.add(crop)

        # Update condition if moisture or irrigation days changed
        if updates.soilMoisture is not None or updates.lastIrrigationDaysAgo is not None:
            latest_cond = self.farm_repo.get_latest_condition(farm.id)
            current_moisture = updates.soilMoisture if updates.soilMoisture is not None else (latest_cond.soil_moisture if latest_cond else 35.0)
            current_days = updates.lastIrrigationDaysAgo if updates.lastIrrigationDaysAgo is not None else (latest_cond.last_irrigation_days_ago if latest_cond else 2)
            
            new_cond = CropCondition(
                farm_id=farm.id,
                soil_moisture=current_moisture,
                last_irrigation_days_ago=current_days
            )
            self.farm_repo.save_condition(new_cond)

        updated_farm = self.farm_repo.update(farm)
        return self._build_farm_response(updated_farm)

    def delete_farm(self, user_id: str, farm_id: str) -> None:
        farm = self.farm_repo.get_by_id(farm_id)
        if not farm:
            raise EntityNotFoundException("Farm", farm_id)
        if farm.user_id != user_id:
            raise ForbiddenException("You do not have permission to delete this farm.")
        self.farm_repo.delete(farm)
