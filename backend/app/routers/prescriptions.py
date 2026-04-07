import logging
import secrets
from datetime import datetime, timedelta, timezone
from collections import Counter

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_prescriber_or_admin
from ..models.user import User
from ..models.prescription import Prescription
from ..models.product import Product
from ..config import settings
from ..schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionPublicResponse,
    PrescriptionStats,
)
from ..services.product import _to_response
from ..rate_limit import limiter
from ..services.email import (
    send_prescription_email,
    send_prescription_viewed_email,
    send_prescription_revoked_email,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/prescriptions", tags=["prescriptions"])

PRESCRIPTION_EXPIRE_DAYS = 30


def _prescription_to_response(
    p: Prescription, prescriber_name: str | None = None
) -> PrescriptionResponse:
    return PrescriptionResponse(
        id=str(p.id),
        prescriberId=str(p.prescriber_id),
        prescriberName=prescriber_name,
        productIds=p.product_ids or [],
        message=p.message,
        token=p.token,
        link=f"{settings.FRONTEND_URL}/prescription/{p.token}",
        emailSent=p.patient_email is None
        and p.created_at < datetime.now(timezone.utc) - timedelta(seconds=10),
        expiresAt=p.expires_at.isoformat(),
        viewedAt=p.viewed_at.isoformat() if p.viewed_at else None,
        createdAt=p.created_at.isoformat(),
    )


async def _send_and_purge_email(
    db: Session,
    prescription_id,
    patient_email: str,
    prescriber_name: str,
    prescriber_profession: str | None,
    prescriber_organization: str | None,
    link: str,
    product_names: list[str],
    message: str | None,
    expires_at_str: str,
) -> None:
    """Send the prescription email then purge patient_email from DB (RGPD)."""
    await send_prescription_email(
        patient_email=patient_email,
        prescriber_name=prescriber_name,
        prescriber_profession=prescriber_profession,
        prescriber_organization=prescriber_organization,
        link=link,
        product_names=product_names,
        message=message,
        expires_at=expires_at_str,
    )
    # Purge email after successful send
    try:
        prescription = (
            db.query(Prescription).filter(Prescription.id == prescription_id).first()
        )
        if prescription:
            prescription.patient_email = None
            db.commit()
            logger.info(
                f"RGPD: patient_email purged for prescription {prescription_id}"
            )
    except Exception:
        logger.error(
            f"Failed to purge patient_email for prescription {prescription_id}",
            exc_info=True,
        )


@router.post(
    "", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED
)
async def create_prescription(
    data: PrescriptionCreate,
    background_tasks: BackgroundTasks,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    if not data.product_ids or len(data.product_ids) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sélectionnez entre 1 et 5 solutions",
        )

    # Verify all product IDs exist
    existing = (
        db.query(Product.id, Product.name)
        .filter(Product.id.in_(data.product_ids))
        .all()
    )
    existing_ids = {row[0] for row in existing}
    missing = set(data.product_ids) - existing_ids
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Produits introuvables : {', '.join(missing)}",
        )
    product_names = [row[1] for row in existing]

    token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(days=PRESCRIPTION_EXPIRE_DAYS)
    prescription = Prescription(
        prescriber_id=user.id,
        patient_email=data.patient_email,
        product_ids=data.product_ids,
        message=data.message,
        token=token,
        expires_at=expires_at,
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # Send email to patient then purge the email from DB
    if data.patient_email:
        link = f"{settings.FRONTEND_URL}/prescription/{token}"
        expires_at_str = expires_at.strftime("%d/%m/%Y")
        background_tasks.add_task(
            _send_and_purge_email,
            db=db,
            prescription_id=prescription.id,
            patient_email=data.patient_email,
            prescriber_name=user.name,
            prescriber_profession=user.profession,
            prescriber_organization=user.organization,
            link=link,
            product_names=product_names,
            message=data.message,
            expires_at_str=expires_at_str,
        )

    return _prescription_to_response(prescription, user.name)


@router.get("", response_model=list[PrescriptionResponse])
def list_prescriptions(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.prescriber_id == user.id)
        .order_by(Prescription.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [_prescription_to_response(p, user.name) for p in prescriptions]


@router.get("/stats", response_model=PrescriptionStats)
def get_stats(
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    all_prescriptions = (
        db.query(Prescription).filter(Prescription.prescriber_id == user.id).all()
    )

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total = len(all_prescriptions)
    this_month = sum(1 for p in all_prescriptions if p.created_at >= month_start)
    viewed = sum(1 for p in all_prescriptions if p.viewed_at is not None)

    # Top prescribed products
    product_counter: Counter[str] = Counter()
    for p in all_prescriptions:
        for pid in p.product_ids or []:
            product_counter[pid] += 1

    top_ids = [pid for pid, _ in product_counter.most_common(5)]
    products_map = {}
    if top_ids:
        products = db.query(Product).filter(Product.id.in_(top_ids)).all()
        products_map = {p.id: p.name for p in products}

    top_products = [
        {"productId": pid, "productName": products_map.get(pid, pid), "count": count}
        for pid, count in product_counter.most_common(5)
    ]

    return PrescriptionStats(
        total=total,
        thisMonth=this_month,
        viewed=viewed,
        topProducts=top_products,
    )


@router.post("/{prescription_id}/renew", response_model=PrescriptionResponse)
async def renew_prescription(
    prescription_id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    prescription = (
        db.query(Prescription)
        .filter(
            Prescription.id == prescription_id, Prescription.prescriber_id == user.id
        )
        .first()
    )
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable"
        )

    prescription.token = secrets.token_urlsafe(48)
    prescription.expires_at = datetime.now(timezone.utc) + timedelta(
        days=PRESCRIPTION_EXPIRE_DAYS
    )
    prescription.viewed_at = None
    db.commit()
    db.refresh(prescription)

    # Note: patient_email was purged after first send, so renew only regenerates the link.
    # The prescriber can share the new link manually.

    return _prescription_to_response(prescription, user.name)


@router.delete("/{prescription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(
    prescription_id: str,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    prescription = (
        db.query(Prescription)
        .filter(
            Prescription.id == prescription_id, Prescription.prescriber_id == user.id
        )
        .first()
    )
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable"
        )
    db.delete(prescription)
    db.commit()


# ─── Public endpoints (no auth) ────────────────────────────────


@router.get("/view/{token}", response_model=PrescriptionPublicResponse)
def view_prescription(
    token: str,
    db: Session = Depends(get_db),
):
    prescription = db.query(Prescription).filter(Prescription.token == token).first()
    if not prescription or prescription.revoked_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable"
        )

    now = datetime.now(timezone.utc)
    expired = now > prescription.expires_at

    # Get prescriber info
    prescriber = db.query(User).filter(User.id == prescription.prescriber_id).first()

    # Get products
    products = []
    if prescription.product_ids:
        product_rows = (
            db.query(Product).filter(Product.id.in_(prescription.product_ids)).all()
        )
        for p in product_rows:
            resp = _to_response(p)
            products.append(
                {
                    "id": resp.id,
                    "name": resp.name,
                    "type": resp.type,
                    "tagline": resp.tagline,
                    "description": resp.description,
                    "url": resp.url,
                    "logo": resp.logo,
                    "scoreLabel": resp.scoreLabel,
                    "scoreTotal": resp.scoreTotal,
                    "pricing": resp.pricing.model_dump() if resp.pricing else None,
                }
            )

    return PrescriptionPublicResponse(
        prescriberName=prescriber.name if prescriber else "Prescripteur",
        prescriberProfession=prescriber.profession if prescriber else None,
        prescriberOrganization=prescriber.organization if prescriber else None,
        message=prescription.message,
        products=products,
        createdAt=prescription.created_at.isoformat(),
        expired=expired,
    )


@router.post("/view/{token}/confirm", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("5/minute")
def confirm_prescription_view(
    request: Request,
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Mark prescription as viewed. Called by frontend after a delay to filter out bots."""
    prescription = db.query(Prescription).filter(Prescription.token == token).first()
    if not prescription or prescription.revoked_at:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable"
        )
    if prescription.viewed_at:
        return

    now = datetime.now(timezone.utc)
    if now > prescription.expires_at:
        return

    prescription.viewed_at = now
    db.commit()
    logger.info(
        f"Prescription {prescription.id} confirmed as viewed (IP: {request.client.host if request.client else 'unknown'})"
    )

    prescriber = db.query(User).filter(User.id == prescription.prescriber_id).first()
    if prescriber and prescriber.email:
        link = f"{settings.FRONTEND_URL}/prescription/{token}"
        background_tasks.add_task(
            send_prescription_viewed_email,
            prescriber_email=prescriber.email,
            prescriber_name=prescriber.name,
            prescription_link=link,
        )


@router.delete("/revoke/{token}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("3/hour")
def revoke_prescription_by_patient(
    request: Request,
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Allow a patient to request deletion of their prescription (RGPD right to erasure)."""
    prescription = db.query(Prescription).filter(Prescription.token == token).first()
    if not prescription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable"
        )
    if prescription.revoked_at:
        return  # Already revoked

    # Soft delete: mark as revoked instead of hard delete
    prescription.revoked_at = datetime.now(timezone.utc)
    prescription.patient_email = None  # RGPD: purge PII
    db.commit()
    logger.info(f"RGPD: prescription {prescription.id} revoked by patient")

    # Notify prescriber
    prescriber = db.query(User).filter(User.id == prescription.prescriber_id).first()
    if prescriber and prescriber.email:
        background_tasks.add_task(
            send_prescription_revoked_email,
            prescriber_email=prescriber.email,
            prescriber_name=prescriber.name,
            dashboard_url=f"{settings.FRONTEND_URL}/prescriber",
        )
