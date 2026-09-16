import json
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.farm import Farm
from app.db.models.scan import CropScan
from app.repositories.farm_repository import FarmRepository
from app.repositories.scan_repository import ScanRepository
from app.services.farm_service import FarmService
from app.services.weather_service import weather_service
from app.services.health_service import HealthService
from app.services.irrigation_service import IrrigationService
from app.services.recommendation_service import RecommendationService
from app.schemas.dashboard import DashboardResponse
from app.schemas.disease import DiseaseResultResponse, DiseasePredictionItem
from app.schemas.history import ScanHistoryItemResponse


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.farm_service = FarmService(db)
        self.health_service = HealthService(db)
        self.irrigation_service = IrrigationService(db)
        self.rec_service = RecommendationService(db)
        self.farm_repo = FarmRepository(db)
        self.scan_repo = ScanRepository(db)

    async def get_dashboard_summary(self, user_id: str, farm_id: Optional[str] = None) -> DashboardResponse:
        user_farms = self.farm_service.get_user_farms(user_id)
        
        selected_farm_resp = None
        if user_farms:
            if farm_id:
                selected_farm_resp = next((f for f in user_farms if f.id == farm_id), user_farms[0])
            else:
                selected_farm_resp = user_farms[0]

        target_farm_id = selected_farm_resp.id if selected_farm_resp else None
        target_location = selected_farm_resp.location if selected_farm_resp else "Vadodara, Gujarat"
        target_lat = selected_farm_resp.coordinates.lat if (selected_farm_resp and selected_farm_resp.coordinates) else None
        target_lng = selected_farm_resp.coordinates.lng if (selected_farm_resp and selected_farm_resp.coordinates) else None

        # 1. Weather
        weather_resp = await weather_service.get_current_weather(target_location, target_lat, target_lng)

        # 2. Crop Health
        health_resp = None
        if target_farm_id:
            try:
                health_resp = self.health_service.get_crop_health(user_id, target_farm_id)
            except Exception:
                pass

        # 3. Irrigation
        irrigation_resp = self.irrigation_service.get_recommendation(target_farm_id)

        # 4. Latest Scan & Recent Activity
        scans = self.scan_repo.get_user_scans(user_id)
        latest_scan_resp = None
        recent_activity: List[ScanHistoryItemResponse] = []

        if scans:
            latest = scans[0]
            farm_name = latest.farm.name if latest.farm else "Registered Parcel"
            next_steps = json.loads(latest.next_steps_json) if latest.next_steps_json else []
            top_preds = [
                DiseasePredictionItem(diseaseName=p.disease_name, confidence=p.confidence, description=p.description)
                for p in latest.predictions
            ]
            latest_scan_resp = DiseaseResultResponse(
                id=latest.id,
                cropName=latest.crop,
                primaryCondition=latest.primary_condition,
                confidence=latest.confidence,
                status=latest.status,  # type: ignore
                isLowConfidence=latest.is_low_confidence,
                isHealthy=latest.is_healthy,
                visualFindings=latest.visual_findings or "",
                nextSteps=next_steps,
                topPredictions=top_preds,
                scannedAt="Today",
                imageUrl=latest.image_url,
                farmId=latest.farm_id,
                farmName=farm_name,
                model_version=latest.model_version
            )

            for s in scans[:5]:
                recent_activity.append(
                    ScanHistoryItemResponse(
                        id=s.id,
                        farmId=s.farm_id or "farm-1",
                        farmName=s.farm.name if s.farm else "General Plot",
                        crop=s.crop,
                        condition=s.primary_condition,
                        confidence=s.confidence,
                        status=s.status,  # type: ignore
                        scanDate=s.created_at.strftime("%b %d, %Y"),
                        thumbnailUrl=s.image_url,
                        healthScoreContribution=s.health_score_contribution
                    )
                )

        # 5. Recommendations
        recs = self.rec_service.get_user_recommendations(user_id, target_farm_id)

        # 6. Farm Insight Banner
        farm_crop = selected_farm_resp.crop if selected_farm_resp else "Crop"
        moisture = selected_farm_resp.soilMoisture if selected_farm_resp else 35.0
        if farm_crop == "Potato":
            insight_text = f"Your Potato crop in {target_location} is in vegetative stage with healthy foliage. Moisture is optimal at {moisture}%. No immediate irrigation required today."
        else:
            insight_text = f"Your latest {farm_crop} leaf scan looks healthy, while soil moisture is at {moisture}%. Rain probability is {weather_resp.rainProbability:.0f}%; review soil conditions before scheduling the next irrigation cycle."

        return DashboardResponse(
            farm=selected_farm_resp,
            weather=weather_resp,
            cropHealth=health_resp,
            irrigation=irrigation_resp,
            latestScan=latest_scan_resp,
            recentActivity=recent_activity,
            recommendations=recs,
            farmInsight=insight_text
        )
