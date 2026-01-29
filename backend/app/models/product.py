from datetime import date, datetime, timezone

from sqlalchemy import String, Text, Boolean, Date, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY

from ..database import Base

import enum


class PricingModel(str, enum.Enum):
    free = "free"
    freemium = "freemium"
    subscription = "subscription"
    per_session = "per-session"
    enterprise = "enterprise"
    custom = "custom"


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    tagline: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    logo: Mapped[str] = mapped_column(String(500), nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    audience: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    problems_solved: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    preference_match: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    for_company: Mapped[bool] = mapped_column(Boolean, default=False)
    pricing_model: Mapped[str | None] = mapped_column(
        SAEnum(
            "free", "freemium", "subscription", "per-session", "enterprise", "custom",
            name="pricing_model_enum",
            create_type=False,
        ),
        nullable=True,
    )
    pricing_amount: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pricing_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    last_updated: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
