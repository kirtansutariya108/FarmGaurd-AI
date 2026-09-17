import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class CropScan(Base):
    __tablename__ = "crop_scans"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: f"scan-{uuid.uuid4().hex[:8]}")
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    farm_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("farms.id", ondelete="SET NULL"), index=True, nullable=True)
    crop: Mapped[str] = mapped_column(String(100), default="Tomato")
    primary_condition: Mapped[str] = mapped_column(String(255), default="Healthy")
    confidence: Mapped[float] = mapped_column(Float, default=0.0)  # percentage, e.g. 91.0
    status: Mapped[str] = mapped_column(String(50), default="Needs Attention")  # Needs Attention, Healthy-looking, Uncertain, Critical
    is_low_confidence: Mapped[bool] = mapped_column(Boolean, default=False)
    is_healthy: Mapped[bool] = mapped_column(Boolean, default=False)
    visual_findings: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    next_steps_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string of action steps list
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), default="mobilenetv2-v1.0.0")
    health_score_contribution: Mapped[int] = mapped_column(Integer, default=5)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="crop_scans")
    farm = relationship("Farm", back_populates="scans")
    predictions = relationship("DiseasePrediction", back_populates="scan", cascade="all, delete-orphan", order_by="DiseasePrediction.rank")


class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=lambda: f"pred-{uuid.uuid4().hex[:8]}")
    scan_id: Mapped[str] = mapped_column(String(64), ForeignKey("crop_scans.id", ondelete="CASCADE"), index=True, nullable=False)
    disease_name: Mapped[str] = mapped_column(String(255), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)  # percentage e.g. 91.0
    rank: Mapped[int] = mapped_column(Integer, default=1)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    scan = relationship("CropScan", back_populates="predictions")
