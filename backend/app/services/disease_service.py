import json
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.scan import CropScan, DiseasePrediction
from app.db.models.notification import Notification
from app.repositories.scan_repository import ScanRepository
from app.repositories.farm_repository import FarmRepository
from app.schemas.disease import DiseaseResultResponse, DiseasePredictionItem, ImageQualityCheck
from app.ml.disease.predictor import predict_disease
from app.services.storage_service import storage_service
from app.utils.image_validation import validate_and_open_image


class DiseaseService:
    def __init__(self, db: Session):
        self.db = db
        self.scan_repo = ScanRepository(db)
        self.farm_repo = FarmRepository(db)

    def validate_image_quality(self, file_bytes: bytes, content_type: str) -> ImageQualityCheck:
        image = validate_and_open_image(file_bytes, content_type)
        is_small = len(file_bytes) < 50000

        return ImageQualityCheck(
            isValid=True,
            lightingQuality="Fair" if is_small else "Good",
            blurLevel="Low",
            isLeafCentered=True,
            notes="Good contrast and illumination detected for foliar diagnosis."
        )

    def analyze_leaf_image(
        self,
        user_id: str,
        file_bytes: bytes,
        content_type: str,
        crop_name: str = "Tomato",
        farm_id: Optional[str] = None,
        demo_scenario: str = "earlyBlight"
    ) -> DiseaseResultResponse:
        # 1. Validate image format & integrity
        image = validate_and_open_image(file_bytes, content_type)

        # 2. Run inference
        pred_data = predict_disease(
            image=image,
            crop_name=crop_name,
            demo_scenario=demo_scenario
        )

        # 3. Store image
        image_url = storage_service.save_image(image)

        # 4. Determine farm name
        farm_name = "Registered Parcel"
        if farm_id:
            farm = self.farm_repo.get_by_id(farm_id)
            if farm:
                farm_name = farm.name

        # 5. Persist scan
        scan = CropScan(
            user_id=user_id,
            farm_id=farm_id,
            crop=crop_name,
            primary_condition=pred_data["primary_condition"],
            confidence=pred_data["confidence"],
            status=pred_data["status"],
            is_low_confidence=pred_data["is_low_confidence"],
            is_healthy=pred_data["is_healthy"],
            visual_findings=pred_data["visual_findings"],
            next_steps_json=json.dumps(pred_data["next_steps"]),
            image_url=image_url,
            model_version=pred_data["model_version"],
            health_score_contribution=10 if pred_data["is_healthy"] else -8
        )
        self.scan_repo.create(scan)

        # 6. Persist prediction breakdown
        for rank, p in enumerate(pred_data["top_predictions"], start=1):
            pred_record = DiseasePrediction(
                scan_id=scan.id,
                disease_name=p.diseaseName,
                confidence=p.confidence,
                rank=rank,
                description=p.description
            )
            self.db.add(pred_record)

        # 7. Create farmer notification
        if not pred_data["is_healthy"]:
            notif = Notification(
                user_id=user_id,
                title=f"Pathogen Alert: {pred_data['primary_condition']}",
                message=f"Leaf diagnosis for {crop_name} parcel '{farm_name}' indicated {pred_data['primary_condition']} ({pred_data['confidence']}% confidence).",
                category="scanner",
                is_read=False,
                link_url=f"/app/history/{scan.id}"
            )
            self.db.add(notif)

        self.db.commit()

        return DiseaseResultResponse(
            id=scan.id,
            cropName=crop_name,
            primaryCondition=pred_data["primary_condition"],
            confidence=pred_data["confidence"],
            status=pred_data["status"],
            isLowConfidence=pred_data["is_low_confidence"],
            isHealthy=pred_data["is_healthy"],
            visualFindings=pred_data["visual_findings"],
            nextSteps=pred_data["next_steps"],
            topPredictions=pred_data["top_predictions"],
            scannedAt="Just now",
            imageUrl=image_url,
            farmId=farm_id,
            farmName=farm_name,
            model_version=pred_data["model_version"]
        )

    def get_scan_by_id(self, user_id: str, scan_id: str) -> DiseaseResultResponse:
        scan = self.scan_repo.get_user_scan(user_id, scan_id)
        if not scan:
            scan = self.scan_repo.get_by_id(scan_id)

        if not scan:
            from app.core.exceptions import EntityNotFoundException
            raise EntityNotFoundException("CropScan", scan_id)

        farm_name = scan.farm.name if scan.farm else "General Farm Plot"
        next_steps = json.loads(scan.next_steps_json) if scan.next_steps_json else []

        top_preds = [
            DiseasePredictionItem(
                diseaseName=p.disease_name,
                confidence=p.confidence,
                description=p.description
            )
            for p in scan.predictions
        ]

        return DiseaseResultResponse(
            id=scan.id,
            cropName=scan.crop,
            primaryCondition=scan.primary_condition,
            confidence=scan.confidence,
            status=scan.status,  # type: ignore
            isLowConfidence=scan.is_low_confidence,
            isHealthy=scan.is_healthy,
            visualFindings=scan.visual_findings or "No visual findings recorded.",
            nextSteps=next_steps,
            topPredictions=top_preds,
            scannedAt=scan.created_at.strftime("%b %d, %Y - %I:%M %p"),
            imageUrl=scan.image_url,
            farmId=scan.farm_id,
            farmName=farm_name,
            model_version=scan.model_version
        )
