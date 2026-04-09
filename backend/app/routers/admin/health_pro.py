from datetime import datetime, timezone

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
from ...models.health_prof_application import HealthProfApplication
from ...schemas.public_submission import (
    HealthProfApplicationResponse,
    AdminSimpleAction,
)
from ...services.email import (
    send_collectif_invite_email,
    send_collectif_refused_email,
)
from .helpers import _health_pro_to_response, CollectiveMemberUpdate

router = APIRouter(tags=["admin"])


# ---- HEALTH PRO APPLICATIONS ----


@router.get(
    "/health-pro-applications", response_model=list[HealthProfApplicationResponse]
)
def list_health_pro_applications(
    status_filter: str | None = Query(default=None, alias="status"),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(HealthProfApplication)
    if status_filter:
        query = query.filter(HealthProfApplication.status == status_filter)
    apps = query.order_by(HealthProfApplication.created_at.desc()).all()
    return [_health_pro_to_response(a) for a in apps]


@router.get(
    "/health-pro-applications/{application_id}",
    response_model=HealthProfApplicationResponse,
)
def get_health_pro_application(
    application_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = (
        db.query(HealthProfApplication)
        .filter(HealthProfApplication.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable"
        )
    return _health_pro_to_response(app)


@router.post(
    "/health-pro-applications/{application_id}/accept",
    response_model=HealthProfApplicationResponse,
)
async def accept_health_pro(
    application_id: str,
    data: AdminSimpleAction,
    background_tasks: BackgroundTasks,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = (
        db.query(HealthProfApplication)
        .filter(HealthProfApplication.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable"
        )

    app.status = "accepted"
    if data.admin_notes:
        app.admin_notes = data.admin_notes
    app.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(app)

    if data.helloasso_url:
        background_tasks.add_task(
            send_collectif_invite_email,
            email=app.email,
            name=app.name,
            helloasso_url=data.helloasso_url,
        )

    return _health_pro_to_response(app)


@router.post(
    "/health-pro-applications/{application_id}/refuse",
    response_model=HealthProfApplicationResponse,
)
async def refuse_health_pro(
    application_id: str,
    data: AdminSimpleAction,
    background_tasks: BackgroundTasks,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = (
        db.query(HealthProfApplication)
        .filter(HealthProfApplication.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable"
        )

    app.status = "refused"
    if data.admin_notes:
        app.admin_notes = data.admin_notes
    app.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(app)

    background_tasks.add_task(
        send_collectif_refused_email,
        email=app.email,
        name=app.name,
        admin_notes=data.admin_notes,
    )

    return _health_pro_to_response(app)


@router.patch(
    "/health-pro-applications/{application_id}/collective-member",
    response_model=HealthProfApplicationResponse,
)
def set_health_pro_collective_member(
    application_id: str,
    body: CollectiveMemberUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    app = (
        db.query(HealthProfApplication)
        .filter(HealthProfApplication.id == application_id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable"
        )

    app.is_collective_member = body.is_collective_member
    app.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(app)
    return _health_pro_to_response(app)
