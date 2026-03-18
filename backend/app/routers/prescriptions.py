import secrets
from datetime import datetime, timedelta, timezone
from collections import Counter

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

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
from ..services.email import (
    send_prescription_email,
    send_prescription_viewed_email,
    send_ambassador_trigger_email,
)

router = APIRouter(prefix="/api/prescriptions", tags=["prescriptions"])

PRESCRIPTION_EXPIRE_DAYS = 30


def _prescription_to_response(p: Prescription, prescriber_name: str | None = None) -> PrescriptionResponse:
    return PrescriptionResponse(
        id=str(p.id),
        prescriberId=str(p.prescriber_id),
        prescriberName=prescriber_name,
        patientName=p.patient_name,
        patientEmail=p.patient_email,
        productIds=p.product_ids or [],
        message=p.message,
        token=p.token,
        link=f"{settings.FRONTEND_URL}/prescription/{p.token}",
        expiresAt=p.expires_at.isoformat(),
        viewedAt=p.viewed_at.isoformat() if p.viewed_at else None,
        createdAt=p.created_at.isoformat(),
    )


@router.post("", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
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
    existing = db.query(Product.id, Product.name).filter(Product.id.in_(data.product_ids)).all()
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
        patient_name=data.patient_name,
        patient_email=data.patient_email,
        product_ids=data.product_ids,
        message=data.message,
        token=token,
        expires_at=expires_at,
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # Ambassador trigger on 3rd prescription
    total_prescriptions = (
        db.query(func.count(Prescription.id))
        .filter(Prescription.prescriber_id == user.id)
        .scalar()
    )
    if total_prescriptions == 3:
        background_tasks.add_task(
            send_ambassador_trigger_email,
            email=user.email,
            name=user.name,
        )

    # Send email to patient if email provided
    if data.patient_email:
        link = f"{settings.FRONTEND_URL}/prescription/{token}"
        expires_at_str = expires_at.strftime("%d/%m/%Y")
        background_tasks.add_task(
            send_prescription_email,
            patient_email=data.patient_email,
            patient_name=data.patient_name,
            prescriber_name=user.name,
            prescriber_profession=user.profession,
            prescriber_organization=user.organization,
            link=link,
            product_names=product_names,
            message=data.message,
            expires_at=expires_at_str,
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
        db.query(Prescription)
        .filter(Prescription.prescriber_id == user.id)
        .all()
    )

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total = len(all_prescriptions)
    this_month = sum(1 for p in all_prescriptions if p.created_at >= month_start)
    viewed = sum(1 for p in all_prescriptions if p.viewed_at is not None)

    # Top prescribed products
    product_counter: Counter[str] = Counter()
    for p in all_prescriptions:
        for pid in (p.product_ids or []):
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
        .filter(Prescription.id == prescription_id, Prescription.prescriber_id == user.id)
        .first()
    )
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable")

    prescription.token = secrets.token_urlsafe(48)
    prescription.expires_at = datetime.now(timezone.utc) + timedelta(days=PRESCRIPTION_EXPIRE_DAYS)
    prescription.viewed_at = None
    db.commit()
    db.refresh(prescription)

    if prescription.patient_email:
        product_rows = db.query(Product).filter(Product.id.in_(prescription.product_ids or [])).all()
        product_names = [p.name for p in product_rows]
        link = f"{settings.FRONTEND_URL}/prescription/{prescription.token}"
        expires_at_str = prescription.expires_at.strftime("%d/%m/%Y")
        background_tasks.add_task(
            send_prescription_email,
            patient_email=prescription.patient_email,
            patient_name=prescription.patient_name,
            prescriber_name=user.name,
            prescriber_profession=user.profession,
            prescriber_organization=user.organization,
            link=link,
            product_names=product_names,
            message=prescription.message,
            expires_at=expires_at_str,
        )

    return _prescription_to_response(prescription, user.name)


@router.delete("/{prescription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(
    prescription_id: str,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    prescription = (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id, Prescription.prescriber_id == user.id)
        .first()
    )
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable")
    db.delete(prescription)
    db.commit()


# Public endpoint - no auth required
@router.get("/view/{token}", response_model=PrescriptionPublicResponse)
def view_prescription(token: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    prescription = db.query(Prescription).filter(Prescription.token == token).first()
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription introuvable")

    now = datetime.now(timezone.utc)
    expired = now > prescription.expires_at

    # Mark as viewed (first time only)
    first_view = not prescription.viewed_at and not expired
    if first_view:
        prescription.viewed_at = now
        db.commit()

    # Get prescriber info
    prescriber = db.query(User).filter(User.id == prescription.prescriber_id).first()

    # Notify prescriber on first view
    if first_view and prescriber and prescriber.email:
        link = f"{settings.FRONTEND_URL}/prescription/{token}"
        background_tasks.add_task(
            send_prescription_viewed_email,
            prescriber_email=prescriber.email,
            prescriber_name=prescriber.name,
            patient_name=prescription.patient_name,
            prescription_link=link,
        )

    # Get products
    products = []
    if prescription.product_ids:
        product_rows = db.query(Product).filter(Product.id.in_(prescription.product_ids)).all()
        for p in product_rows:
            resp = _to_response(p)
            products.append({
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
            })

    return PrescriptionPublicResponse(
        prescriberName=prescriber.name if prescriber else "Prescripteur",
        prescriberProfession=prescriber.profession if prescriber else None,
        prescriberOrganization=prescriber.organization if prescriber else None,
        patientName=prescription.patient_name,
        message=prescription.message,
        products=products,
        createdAt=prescription.created_at.isoformat(),
        expired=expired,
    )
