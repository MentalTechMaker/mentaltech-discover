import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from ..compat_types import CompatibleUUID as UUID

from ..database import Base


class CharterSignatory(Base):
    __tablename__ = "charter_signatories"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    kind: Mapped[str] = mapped_column(String(30), nullable=False)  # company | individual | institution
    consent: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # La charte 2026 repart de zero : les signatures fraiches (`form`) et les
    # 130+ signataires historiques 2023 importes plus tard (`import-2023`) ne
    # doivent jamais se melanger dans un compteur. Voir _docs/decisions/
    # 2026-07-13-discover-backend-du-collectif.md.
    source: Mapped[str] = mapped_column(String(30), nullable=False, default="form")

    # La charte evoluera ; sans cette colonne, "qui a signe quelle version" est
    # irrecuperable retroactivement. Une ligne aujourd'hui, une impasse sinon.
    charter_version: Mapped[str] = mapped_column(String(20), nullable=False, default="2026")

    status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="pending_email"
    )
    confirm_token: Mapped[str | None] = mapped_column(
        String(500), nullable=True, unique=True
    )
    email_confirmed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )

    # La vraie date de signature, pas la date d'insertion en base (import-2023
    # portera une signed_at de 2023, bien anterieure a created_at).
    signed_at: Mapped[datetime | None] = mapped_column(
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
