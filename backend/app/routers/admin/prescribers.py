from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from ...database import get_db
from ...dependencies import require_admin
from ...models.user import User
from ...schemas.prescriber import PrescriberListItem
from ...services.email import send_prescriber_approved_email
from ...config import settings

router = APIRouter(tags=["admin"])


# ---- PRESCRIBER VALIDATION ----


@router.get("/prescribers", response_model=list[PrescriberListItem])
def list_prescribers(
    pending_only: bool = Query(default=False),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role == "prescriber")
    if pending_only:
        query = query.filter(User.is_verified_prescriber == False)
    prescribers = query.order_by(User.created_at.desc()).all()

    return [
        PrescriberListItem(
            id=str(p.id),
            email=p.email,
            name=p.name,
            profession=p.profession,
            organization=p.organization,
            rpps_adeli=p.rpps_adeli,
            is_verified_prescriber=p.is_verified_prescriber,
            created_at=p.created_at.isoformat(),
        )
        for p in prescribers
    ]


@router.post("/prescribers/{prescriber_id}/verify")
async def verify_prescriber(
    prescriber_id: str,
    background_tasks: BackgroundTasks,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == prescriber_id, User.role == "prescriber")
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable"
        )

    user.is_verified_prescriber = True
    db.commit()

    dashboard_url = f"{settings.FRONTEND_URL}/prescriber"
    background_tasks.add_task(
        send_prescriber_approved_email,
        email=user.email,
        name=user.name,
        dashboard_url=dashboard_url,
    )

    return {"message": f"Prescripteur {user.name} validé avec succès"}


@router.post("/prescribers/{prescriber_id}/reject")
def reject_prescriber(
    prescriber_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == prescriber_id, User.role == "prescriber")
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable"
        )

    user.is_verified_prescriber = False
    db.commit()

    return {"message": f"Prescripteur {user.name} refusé"}
