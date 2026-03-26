import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from ..compat_types import CompatibleUUID as UUID

from ..database import Base


class HealthProfApplication(Base):
    __tablename__ = "health_prof_applications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    profession: Mapped[str] = mapped_column(String(255), nullable=False)
    rpps_adeli: Mapped[str | None] = mapped_column(String(50), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    motivation: Mapped[str | None] = mapped_column(Text, nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="pending_email"
    )
    confirm_token: Mapped[str | None] = mapped_column(String(500), nullable=True, unique=True)
    email_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_collective_member: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
