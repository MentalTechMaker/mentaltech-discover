import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from ..compat_types import CompatibleUUID as UUID

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    profession: Mapped[str | None] = mapped_column(String(255), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rpps_adeli: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_verified_prescriber: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    siret: Mapped[str | None] = mapped_column(String(20), nullable=True)
    company_website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_verified_publisher: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    password_changed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, default=None
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
