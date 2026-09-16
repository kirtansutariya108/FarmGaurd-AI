import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Farm(Base):
    __tablename__ = "farms"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"farm-{uuid.uuid4().hex[:8]}")
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    area_acres: Mapped[float] = mapped_column(Float, default=2.5)
    area_unit: Mapped[str] = mapped_column(String(20), default="Acres")
    soil_type: Mapped[str] = mapped_column(String(50), default="Loamy")  # Loamy, Clay, Sandy, Silty, Black Soil, Other
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    user = relationship("User", back_populates="farms")
    crops = relationship("FarmCrop", back_populates="farm", cascade="all, delete-orphan")
    conditions = relationship("CropCondition", back_populates="farm", cascade="all, delete-orphan")
    scans = relationship("CropScan", back_populates="farm", cascade="all, delete-orphan")
    irrigation_recommendations = relationship("IrrigationRecommendation", back_populates="farm", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="farm", cascade="all, delete-orphan")
    weather_snapshots = relationship("WeatherSnapshot", back_populates="farm", cascade="all, delete-orphan")


class FarmCrop(Base):
    __tablename__ = "farm_crops"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"crop-{uuid.uuid4().hex[:8]}")
    farm_id: Mapped[str] = mapped_column(String, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    crop_name: Mapped[str] = mapped_column(String(100), nullable=False)  # Tomato, Potato, Pepper, etc.
    crop_variety: Mapped[str] = mapped_column(String(100), default="Standard Hybrid")
    growth_stage: Mapped[str] = mapped_column(String(50), default="Flowering")  # Seedling, Vegetative, Flowering, Fruiting, Maturity
    planting_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    farm = relationship("Farm", back_populates="crops")


class CropCondition(Base):
    __tablename__ = "crop_conditions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"cond-{uuid.uuid4().hex[:8]}")
    farm_id: Mapped[str] = mapped_column(String, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    soil_moisture: Mapped[float] = mapped_column(Float, default=35.0)  # percentage
    temperature: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    humidity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rain_probability: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    wind_speed: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    last_irrigation_days_ago: Mapped[int] = mapped_column(Integer, default=2)
    last_irrigation_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    farm = relationship("Farm", back_populates="conditions")
