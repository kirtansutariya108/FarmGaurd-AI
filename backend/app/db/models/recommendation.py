import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: f"rec-{uuid.uuid4().hex[:8]}")
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    farm_id: Mapped[str] = mapped_column(String, ForeignKey("farms.id", ondelete="CASCADE"), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="General")  # Disease, Irrigation, Weather, Field Care, General
    status: Mapped[str] = mapped_column(String(50), default="Today")      # Urgent, Today, Monitor, Completed
    priority: Mapped[str] = mapped_column(String(20), default="Medium")   # High, Medium, Low
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    action_text: Mapped[str] = mapped_column(String(255), nullable=False)
    action_link: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="recommendations")
    farm = relationship("Farm", back_populates="recommendations")
