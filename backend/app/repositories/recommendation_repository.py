from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models.recommendation import Recommendation


class RecommendationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, rec_id: str) -> Optional[Recommendation]:
        return self.db.query(Recommendation).filter(Recommendation.id == rec_id).first()

    def get_user_recommendations(
        self,
        user_id: str,
        farm_id: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Recommendation]:
        query = self.db.query(Recommendation).filter(Recommendation.user_id == user_id)
        if farm_id:
            query = query.filter(Recommendation.farm_id == farm_id)
        if status and status != "All":
            query = query.filter(Recommendation.status == status)
        return query.order_by(desc(Recommendation.created_at)).all()

    def create(self, rec: Recommendation) -> Recommendation:
        self.db.add(rec)
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def update(self, rec: Recommendation) -> Recommendation:
        self.db.commit()
        self.db.refresh(rec)
        return rec
