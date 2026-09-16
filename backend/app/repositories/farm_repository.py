from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models.farm import Farm, FarmCrop, CropCondition


class FarmRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, farm_id: str) -> Optional[Farm]:
        return self.db.query(Farm).filter(Farm.id == farm_id).first()

    def get_by_user_id(self, user_id: str) -> List[Farm]:
        return self.db.query(Farm).filter(Farm.user_id == user_id).all()

    def get_user_farm(self, user_id: str, farm_id: str) -> Optional[Farm]:
        return self.db.query(Farm).filter(Farm.user_id == user_id, Farm.id == farm_id).first()

    def create(self, farm: Farm) -> Farm:
        self.db.add(farm)
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def update(self, farm: Farm) -> Farm:
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def delete(self, farm: Farm) -> None:
        self.db.delete(farm)
        self.db.commit()

    def get_latest_condition(self, farm_id: str) -> Optional[CropCondition]:
        return (
            self.db.query(CropCondition)
            .filter(CropCondition.farm_id == farm_id)
            .order_by(CropCondition.recorded_at.desc())
            .first()
        )

    def save_condition(self, condition: CropCondition) -> CropCondition:
        self.db.add(condition)
        self.db.commit()
        self.db.refresh(condition)
        return condition
