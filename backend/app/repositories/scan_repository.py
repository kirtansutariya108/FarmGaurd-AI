from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models.scan import CropScan, DiseasePrediction


class ScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, scan_id: str) -> Optional[CropScan]:
        return self.db.query(CropScan).filter(CropScan.id == scan_id).first()

    def get_user_scan(self, user_id: str, scan_id: str) -> Optional[CropScan]:
        return self.db.query(CropScan).filter(CropScan.user_id == user_id, CropScan.id == scan_id).first()

    def get_user_scans(
        self,
        user_id: str,
        crop: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[CropScan]:
        query = self.db.query(CropScan).filter(CropScan.user_id == user_id)
        if crop:
            query = query.filter(CropScan.crop.ilike(f"%{crop}%"))
        if status and status != "All":
            if status == "Attention":
                query = query.filter(CropScan.status == "Needs Attention")
            elif status == "Healthy":
                query = query.filter(CropScan.status == "Healthy-looking")
            else:
                query = query.filter(CropScan.status == status)
        if search:
            query = query.filter(
                (CropScan.crop.ilike(f"%{search}%")) |
                (CropScan.primary_condition.ilike(f"%{search}%"))
            )
        return query.order_by(desc(CropScan.created_at)).all()

    def get_latest_farm_scan(self, farm_id: str) -> Optional[CropScan]:
        return (
            self.db.query(CropScan)
            .filter(CropScan.farm_id == farm_id)
            .order_by(desc(CropScan.created_at))
            .first()
        )

    def create(self, scan: CropScan) -> CropScan:
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def delete(self, scan: CropScan) -> None:
        self.db.delete(scan)
        self.db.commit()
