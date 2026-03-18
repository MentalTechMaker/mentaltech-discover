from datetime import date, datetime, timezone

from sqlalchemy import String, Text, Boolean, Date, DateTime, Enum as SAEnum, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import ARRAY, JSONB

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
    is_mentaltech_member: Mapped[bool] = mapped_column(Boolean, default=False)
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

    # Visibility & status
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, server_default="true")
    company_defunct: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")

    # Quality scoring (0-20 each, nullable = not yet evaluated)
    score_security: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    score_efficacy: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    score_accessibility: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    score_ux: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    score_support: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)

    # Justifications (free text: research docs, testimonials, etc.)
    justification_security: Mapped[str | None] = mapped_column(Text, nullable=True)
    justification_efficacy: Mapped[str | None] = mapped_column(Text, nullable=True)
    justification_accessibility: Mapped[str | None] = mapped_column(Text, nullable=True)
    justification_ux: Mapped[str | None] = mapped_column(Text, nullable=True)
    justification_support: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Detailed protocol answers (JSONB, keyed by pillar/criterion)
    scoring_criteria: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
