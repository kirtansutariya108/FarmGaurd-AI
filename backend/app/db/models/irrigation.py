import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class IrrigationRecommendation(Base):
    __tablename__ = "irrigation_recommendations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"irrig-{uuid.uuid4().hex[:8]}")
    farm_id: Mapped[str] = mapped_column(String, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Recommended")  # Recommended, Monitor, Not Needed, Insufficient Data
    priority: Mapped[str] = mapped_column(String(20), default="Medium")      # High, Medium, Low
    headline: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    reasons_json: Mapped[str] = mapped_column(Text, nullable=False)          # JSON array of reasons
    action_advice: Mapped[str] = mapped_column(Text, nullable=False)
    field_signals_json: Mapped[str] = mapped_column(Text, nullable=False)    # JSON object of field signals
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    farm = relationship("Farm", back_populates="irrigation_recommendations")
