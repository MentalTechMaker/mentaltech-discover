import uuid
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

from ...utils import public_submission_to_response
from ...database import get_db
from ...dependencies import require_admin
from ...models.user import User
from ...models.product import Product
from ...models.public_submission import PublicSubmission
from ...schemas.publisher import AdminReviewAction
from ...schemas.public_submission import (
    PublicSubmissionResponse,
    AdminCollectifAction,
)
from ...services.email import (
    send_submission_approved_email,
    send_submission_rejected_email,
    send_collectif_invite_email,
    send_collectif_refused_email,
)
from .helpers import _slugify, CollectiveMemberUpdate

_pub_sub_to_response = public_submission_to_response

router = APIRouter(tags=["admin"])


# ---- PUBLIC SUBMISSIONS (formulaire anonyme sans compte) ----


@router.get("/public-submissions", response_model=list[PublicSubmissionResponse])
def list_public_submissions(
    status_filter: str | None = Query(default=None, alias="status"),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(PublicSubmission)
    if status_filter:
        query = query.filter(PublicSubmission.status == status_filter)
    submissions = query.order_by(PublicSubmission.created_at.desc()).all()
    return [_pub_sub_to_response(s) for s in submissions]


@router.get(
    "/public-submissions/{submission_id}", response_model=PublicSubmissionResponse
)
def get_public_submission(
    submission_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )
    return _pub_sub_to_response(sub)


@router.post(
    "/public-submissions/{submission_id}/approve",
    response_model=PublicSubmissionResponse,
)
async def approve_public_submission(
    submission_id: str,
    data: AdminReviewAction,
    background_tasks: BackgroundTasks,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    if sub.status in ("approved", "rejected"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Soumission déjà traitée"
        )

    # Create product (or link to existing one)
    if data.product_id:
        sub.product_id = data.product_id
    if sub.product_id:
        product = db.query(Product).filter(Product.id == sub.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produit lié introuvable"
            )
    else:
        product_id = _slugify(sub.name or "solution")
        if db.query(Product).filter(Product.id == product_id).first():
            product_id = f"{product_id}-{uuid.uuid4().hex[:6]}"
        product = Product(id=product_id, is_visible=False)
        db.add(product)

    product.name = sub.name or "Sans titre"
    product.tagline = sub.tagline or ""
    product.description = sub.description or ""
    product.url = sub.url or ""
    product.logo = sub.logo or ""
    product.tags = sub.tags or []
    product.audience = sub.audience or []
    product.problems_solved = sub.problems_solved or []
    product.audience_priorities = sub.audience_priorities or {}
    product.problems_priorities = sub.problems_priorities or {}
    product.preference_match = sub.preference_match or []
    product.pricing_model = sub.pricing_model
    product.pricing_amount = sub.pricing_amount
    product.pricing_details = sub.pricing_details

    if data.score_security is not None:
        product.score_security = data.score_security
    if data.score_efficacy is not None:
        product.score_efficacy = data.score_efficacy
    if data.score_accessibility is not None:
        product.score_accessibility = data.score_accessibility
    if data.score_ux is not None:
        product.score_ux = data.score_ux
    if data.score_support is not None:
        product.score_support = data.score_support
    if data.justification_security is not None:
        product.justification_security = data.justification_security
    if data.justification_efficacy is not None:
        product.justification_efficacy = data.justification_efficacy
    if data.justification_accessibility is not None:
        product.justification_accessibility = data.justification_accessibility
    if data.justification_ux is not None:
        product.justification_ux = data.justification_ux
    if data.justification_support is not None:
        product.justification_support = data.justification_support

    sub.status = "approved"
    sub.admin_notes = data.admin_notes
    sub.admin_id = admin.id
    sub.reviewed_at = datetime.now(timezone.utc)
    sub.product_id = product.id
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)

    background_tasks.add_task(
        send_submission_approved_email,
        email=sub.contact_email,
        name=sub.contact_name,
        product_name=sub.name,
    )

    return _pub_sub_to_response(sub)


@router.post(
    "/public-submissions/{submission_id}/reject",
    response_model=PublicSubmissionResponse,
)
async def reject_public_submission(
    submission_id: str,
    data: AdminReviewAction,
    background_tasks: BackgroundTasks,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    sub.status = "rejected"
    sub.admin_notes = data.admin_notes
    sub.admin_id = admin.id
    sub.reviewed_at = datetime.now(timezone.utc)
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)

    background_tasks.add_task(
        send_submission_rejected_email,
        email=sub.contact_email,
        name=sub.contact_name,
        product_name=sub.name,
        admin_notes=data.admin_notes,
    )

    return _pub_sub_to_response(sub)


@router.post(
    "/public-submissions/{submission_id}/under-review",
    response_model=PublicSubmissionResponse,
)
def mark_public_submission_under_review(
    submission_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )
    if sub.status != "submitted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Statut incompatible"
        )
    sub.status = "under_review"
    sub.admin_id = admin.id
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)
    return _pub_sub_to_response(sub)


@router.post(
    "/public-submissions/{submission_id}/request-changes",
    response_model=PublicSubmissionResponse,
)
def request_public_submission_changes(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    sub.status = "changes_requested"
    sub.admin_notes = data.admin_notes
    sub.admin_id = admin.id
    sub.reviewed_at = datetime.now(timezone.utc)
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)
    return _pub_sub_to_response(sub)


@router.post(
    "/public-submissions/{submission_id}/collectif-status",
    response_model=PublicSubmissionResponse,
)
async def update_collectif_status(
    submission_id: str,
    data: AdminCollectifAction,
    background_tasks: BackgroundTasks,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    if data.collectif_status not in ("discussing", "accepted", "refused"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Statut collectif invalide"
        )

    sub.collectif_status = data.collectif_status
    if data.admin_notes:
        sub.admin_notes = data.admin_notes
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)

    contact_email = sub.collectif_contact_email or sub.contact_email

    if data.collectif_status == "accepted" and data.helloasso_url:
        background_tasks.add_task(
            send_collectif_invite_email,
            email=contact_email,
            name=sub.contact_name,
            helloasso_url=data.helloasso_url,
        )
    elif data.collectif_status == "refused":
        background_tasks.add_task(
            send_collectif_refused_email,
            email=contact_email,
            name=sub.contact_name,
            admin_notes=data.admin_notes,
        )

    return _pub_sub_to_response(sub)


@router.patch(
    "/public-submissions/{submission_id}/collective-member",
    response_model=PublicSubmissionResponse,
)
def set_public_submission_collective_member(
    submission_id: str,
    body: CollectiveMemberUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(PublicSubmission).filter(PublicSubmission.id == submission_id).first()
    )
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    is_member = body.is_collective_member

    # If product exists, update is_mentaltech_member on it
    if sub.product_id:
        product = db.query(Product).filter(Product.id == sub.product_id).first()
        if product:
            product.is_mentaltech_member = is_member
    sub.collectif_status = "accepted" if is_member else sub.collectif_status
    sub.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sub)
    return _pub_sub_to_response(sub)
