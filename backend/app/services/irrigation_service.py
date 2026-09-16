import json
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models.farm import Farm, CropCondition
from app.db.models.irrigation import IrrigationRecommendation
from app.repositories.farm_repository import FarmRepository
from app.schemas.irrigation import (
    IrrigationRecommendationResponse,
    UpdateFieldConditionsRequest
)
from app.ml.irrigation.predictor import predict_irrigation


class IrrigationService:
    def __init__(self, db: Session):
        self.db = db
        self.farm_repo = FarmRepository(db)

    def get_recommendation(self, farm_id: Optional[str] = None) -> IrrigationRecommendationResponse:
        crop = "Tomato"
        growth_stage = "Flowering"
        soil_moisture: Optional[float] = 35.0
        last_irrigation_days_ago: Optional[int] = 2
        temperature = 28.0
        humidity = 72.0
        rain_probability = 30.0

        if farm_id:
            farm = self.farm_repo.get_by_id(farm_id)
            if farm:
                if farm.crops:
                    crop = farm.crops[0].crop_name
                    growth_stage = farm.crops[0].growth_stage
                latest_cond = self.farm_repo.get_latest_condition(farm.id)
                if latest_cond:
                    soil_moisture = latest_cond.soil_moisture
                    last_irrigation_days_ago = latest_cond.last_irrigation_days_ago
                    if latest_cond.temperature is not None:
                        temperature = latest_cond.temperature
                    if latest_cond.humidity is not None:
                        humidity = latest_cond.humidity
                    if latest_cond.rain_probability is not None:
                        rain_probability = latest_cond.rain_probability

        return predict_irrigation(
            crop=crop,
            growth_stage=growth_stage,
            soil_moisture=soil_moisture,
            temperature=temperature,
            humidity=humidity,
            rain_probability=rain_probability,
            last_irrigation_days_ago=last_irrigation_days_ago
        )

    def update_field_conditions(
        self,
        data: UpdateFieldConditionsRequest
    ) -> IrrigationRecommendationResponse:
        farm_id = data.farmId or "farm-1"
        farm = self.farm_repo.get_by_id(farm_id)

        crop = "Tomato"
        growth_stage = "Flowering"
        if farm and farm.crops:
            crop = farm.crops[0].crop_name
            growth_stage = farm.crops[0].growth_stage

        # Persist new condition snapshot
        new_cond = CropCondition(
            farm_id=farm_id,
            soil_moisture=data.soilMoisture,
            last_irrigation_days_ago=data.lastIrrigationDaysAgo,
            temperature=data.temperature or 28.0,
            humidity=data.humidity or 72.0,
            rain_probability=data.rainProbability or 30.0
        )
        self.farm_repo.save_condition(new_cond)

        # Generate fresh recommendation
        rec_response = predict_irrigation(
            crop=crop,
            growth_stage=growth_stage,
            soil_moisture=data.soilMoisture,
            temperature=data.temperature or 28.0,
            humidity=data.humidity or 72.0,
            rain_probability=data.rainProbability or 30.0,
            last_irrigation_days_ago=data.lastIrrigationDaysAgo
        )

        # Log recommendation record
        if farm:
            rec_record = IrrigationRecommendation(
                farm_id=farm.id,
                status=rec_response.status,
                priority=rec_response.priority,
                headline=rec_response.headline,
                summary=rec_response.summary,
                reasons_json=json.dumps(rec_response.reasons),
                action_advice=rec_response.actionAdvice,
                field_signals_json=rec_response.fieldSignals.model_dump_json()
            )
            self.db.add(rec_record)
            self.db.commit()

        return rec_response
