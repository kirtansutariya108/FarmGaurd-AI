import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class WeatherSnapshot(Base):
    __tablename__ = "weather_snapshots"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"wthr-{uuid.uuid4().hex[:8]}")
    farm_id: Mapped[str] = mapped_column(String, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    current_temp: Mapped[float] = mapped_column(Float, nullable=False)
    condition: Mapped[str] = mapped_column(String(100), nullable=False)
    humidity: Mapped[float] = mapped_column(Float, nullable=False)
    rain_probability: Mapped[float] = mapped_column(Float, nullable=False)
    wind_speed_kmh: Mapped[float] = mapped_column(Float, default=14.0)
    uv_index: Mapped[float] = mapped_column(Float, default=6.0)
    soil_temp: Mapped[float] = mapped_column(Float, default=24.0)
    forecast_json: Mapped[str] = mapped_column(Text, nullable=False)  # JSON array of ForecastDay objects
    farm_insight: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    farm = relationship("Farm", back_populates="weather_snapshots")
