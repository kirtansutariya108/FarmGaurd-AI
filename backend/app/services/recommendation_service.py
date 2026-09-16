from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models.recommendation import Recommendation
from app.repositories.recommendation_repository import RecommendationRepository
from app.repositories.farm_repository import FarmRepository
from app.repositories.scan_repository import ScanRepository
from app.schemas.recommendation import (
    ActionableRecommendationResponse,
    RecommendationStatusType
)
from app.decision_engine.recommendations import synthesize_recommendations
from app.core.exceptions import EntityNotFoundException, ForbiddenException


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
        self.rec_repo = RecommendationRepository(db)
        self.farm_repo = FarmRepository(db)
        self.scan_repo = ScanRepository(db)

    def get_user_recommendations(
        self,
        user_id: str,
        farm_id: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[ActionableRecommendationResponse]:
        db_recs = self.rec_repo.get_user_recommendations(user_id, farm_id, status)
        
        # If no recommendations exist in DB, synthesize on the fly for active farm
        if not db_recs:
            farms = self.farm_repo.get_by_user_id(user_id)
            if farms:
                farm = farms[0]
                crop_name = farm.crops[0].crop_name if farm.crops else "Tomato"
                latest_cond = self.farm_repo.get_latest_condition(farm.id)
                latest_scan = self.scan_repo.get_latest_farm_scan(farm.id)
                
                moisture = latest_cond.soil_moisture if latest_cond else 32.0
                dis_cond = latest_scan.primary_condition if latest_scan else None
                dis_status = latest_scan.status if latest_scan else None

                synthesized = synthesize_recommendations(
                    farm_id=farm.id,
                    farm_name=farm.name,
                    crop=crop_name,
                    soil_moisture=moisture,
                    disease_condition=dis_cond,
                    disease_status=dis_status
                )
                for s in synthesized:
                    db_rec = Recommendation(
                        id=s.id,
                        user_id=user_id,
                        farm_id=farm.id,
                        category=s.category,
                        status=s.status,
                        priority=s.priority,
                        title=s.title,
                        description=s.description,
                        action_text=s.actionText,
                        action_link=s.actionLink
                    )
                    self.rec_repo.create(db_rec)
                db_recs = self.rec_repo.get_user_recommendations(user_id, farm_id, status)

        results: List[ActionableRecommendationResponse] = []
        for r in db_recs:
            farm_name = r.farm.name if r.farm else "Registered Parcel"
            crop_name = r.farm.crops[0].crop_name if (r.farm and r.farm.crops) else "Crop"
            results.append(
                ActionableRecommendationResponse(
                    id=r.id,
                    category=r.category,  # type: ignore
                    status=r.status,      # type: ignore
                    priority=r.priority,  # type: ignore
                    title=r.title,
                    description=r.description,
                    actionText=r.action_text,
                    actionLink=r.action_link,
                    farmId=r.farm_id,
                    farmName=farm_name,
                    crop=crop_name,
                    createdAt=r.created_at.strftime("%b %d, %Y"),
                    completedAt=r.completed_at.strftime("%b %d, %Y") if r.completed_at else None
                )
            )
        return results

    def mark_completed(self, user_id: str, rec_id: str) -> ActionableRecommendationResponse:
        rec = self.rec_repo.get_by_id(rec_id)
        if not rec:
            raise EntityNotFoundException("Recommendation", rec_id)
        if rec.user_id != user_id:
            raise ForbiddenException("You do not have permission to modify this recommendation.")

        rec.status = "Completed"
        rec.completed_at = datetime.now(timezone.utc)
        updated = self.rec_repo.update(rec)

        farm_name = updated.farm.name if updated.farm else "Registered Parcel"
        crop_name = updated.farm.crops[0].crop_name if (updated.farm and updated.farm.crops) else "Crop"

        return ActionableRecommendationResponse(
            id=updated.id,
            category=updated.category,  # type: ignore
            status=updated.status,      # type: ignore
            priority=updated.priority,  # type: ignore
            title=updated.title,
            description=updated.description,
            actionText=updated.action_text,
            actionLink=updated.action_link,
            farmId=updated.farm_id,
            farmName=farm_name,
            crop=crop_name,
            createdAt=updated.created_at.strftime("%b %d, %Y"),
            completedAt="Just now"
        )
