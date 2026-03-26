import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from ..compat_types import CompatibleUUID as UUID
from ..compat_types import CompatibleArray as ARRAY, CompatibleJSONB as JSONB

from ..database import Base


class ProductSubmission(Base):
    __tablename__ = "product_submissions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    publisher_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False
    )
    product_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="draft")

    # Basic product info
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tagline: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(500), nullable=True)
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    audience: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    problems_solved: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    pricing_model: Mapped[str | None] = mapped_column(String(50), nullable=True)
    pricing_amount: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pricing_details: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Structured protocol answers (JSONB)
    protocol_answers: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Admin review
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    admin_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
