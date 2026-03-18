import re
import uuid
from datetime import date, datetime, timezone
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from ..models.user import User
from ..models.product import Product
from ..models.product_update import ProductUpdate
from ..models.product_submission import ProductSubmission
from ..schemas.prescriber import PrescriberListItem, ProductUpdateCreate, ProductUpdateResponse
from ..schemas.publisher import (
    AdminCreateAndPublishSchema,
    AdminReviewAction,
    PublisherListItem,
    SubmissionResponse,
)
from ..schemas.product import ProductResponse
from ..services.product import _to_response as product_to_response, get_all_products as svc_get_all_products
from ..services.email import send_prescriber_approved_email, send_publisher_approved_email
from ..config import settings

LOGO_UPLOAD_DIR = Path("/tmp/uploads/logos")
LOGO_ALLOWED_TYPES = {"image/png", "image/jpeg", "image/svg+xml", "image/webp"}
LOGO_MAX_SIZE = 2 * 1024 * 1024  # 2 MB

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ─── ADMIN PRODUCTS (includes hidden/defunct) ───────────────

@router.get("/products", response_model=list[ProductResponse])
def list_all_products(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return ALL products including hidden/defunct ones (admin only)."""
    return svc_get_all_products(db, include_all=True)


@router.patch("/products/{product_id}/visibility", response_model=ProductResponse)
def toggle_product_visibility(
    product_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Toggle is_visible for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable")
    product.is_visible = not product.is_visible
    db.commit()
    db.refresh(product)
    return product_to_response(product)


@router.patch("/products/{product_id}/defunct", response_model=ProductResponse)
def toggle_product_defunct(
    product_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Toggle company_defunct for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable")
    product.company_defunct = not product.company_defunct
    db.commit()
    db.refresh(product)
    return product_to_response(product)


# ─── LOGO UPLOAD ────────────────────────────────────────────

@router.post("/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    _admin: User = Depends(require_admin),
):
    if file.content_type not in LOGO_ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type de fichier non supporté. Types acceptés : PNG, JPEG, SVG, WebP",
        )

    content = await file.read()
    if len(content) > LOGO_MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier trop volumineux (max 2 Mo)",
        )

    ext = Path(file.filename or "logo").suffix or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"

    LOGO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = LOGO_UPLOAD_DIR / filename
    dest.write_bytes(content)

    return JSONResponse({"path": f"/uploads/logos/{filename}"})


# ─── PRESCRIBER VALIDATION ───────────────────────────────────

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
    user = db.query(User).filter(User.id == prescriber_id, User.role == "prescriber").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable")

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
    user = db.query(User).filter(User.id == prescriber_id, User.role == "prescriber").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable")

    user.is_verified_prescriber = False
    db.commit()

    return {"message": f"Prescripteur {user.name} refusé"}


# ─── PRODUCT UPDATES (VEILLE) ────────────────────────────────

@router.post("/product-updates", response_model=ProductUpdateResponse, status_code=status.HTTP_201_CREATED)
def create_product_update(
    data: ProductUpdateCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    from ..models.product import Product

    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable")

    valid_types = ("price_change", "score_change", "new_feature", "study", "general")
    if data.update_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type invalide. Types valides : {', '.join(valid_types)}",
        )

    update = ProductUpdate(
        product_id=data.product_id,
        update_type=data.update_type,
        title=data.title,
        description=data.description,
    )
    db.add(update)
    db.commit()
    db.refresh(update)

    return ProductUpdateResponse(
        id=str(update.id),
        productId=update.product_id,
        productName=product.name,
        updateType=update.update_type,
        title=update.title,
        description=update.description,
        createdAt=update.created_at.isoformat(),
    )


# ─── ADMIN CREATE AND PUBLISH ──────────────────────────────

@router.post("/submissions/create-and-publish", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_and_publish(
    data: AdminCreateAndPublishSchema,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Create a submission and immediately publish it as a product (admin shortcut)."""

    # 1. Resolve product id
    if data.id and data.id.strip():
        product_id = data.id.strip()
    else:
        base_id = _slugify(data.name)
        # Only append suffix when creating (no explicit ID means it's new)
        if db.query(Product).filter(Product.id == base_id).first():
            product_id = f"{base_id}-{uuid.uuid4().hex[:6]}"
        else:
            product_id = base_id

    # 2. Create audit submission
    submission = ProductSubmission(
        publisher_id=admin.id,
        status="approved",
        admin_id=admin.id,
        product_id=product_id,
        name=data.name,
        type=data.type,
        tagline=data.tagline,
        description=data.description,
        url=data.url,
        logo=data.logo,
        tags=data.tags,
        audience=data.audience,
        problems_solved=data.problems_solved,
        pricing_model=data.pricing_model,
        pricing_amount=data.pricing_amount,
        pricing_details=data.pricing_details,
        protocol_answers=data.protocol_answers,
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(submission)

    # 3. Upsert product
    existing = db.query(Product).filter(Product.id == product_id).first()
    if existing:
        existing.name = data.name
        existing.type = data.type
        existing.tagline = data.tagline
        existing.description = data.description
        existing.url = data.url
        if data.logo:
            existing.logo = data.logo
        existing.tags = data.tags
        existing.audience = data.audience
        existing.problems_solved = data.problems_solved
        existing.preference_match = data.preference_match
        existing.is_mentaltech_member = data.is_mentaltech_member
        existing.pricing_model = data.pricing_model
        existing.pricing_amount = data.pricing_amount
        existing.pricing_details = data.pricing_details
        existing.score_security = data.score_security
        existing.score_efficacy = data.score_efficacy
        existing.score_accessibility = data.score_accessibility
        existing.score_ux = data.score_ux
        existing.score_support = data.score_support
        existing.justification_security = data.justification_security
        existing.justification_efficacy = data.justification_efficacy
        existing.justification_accessibility = data.justification_accessibility
        existing.justification_ux = data.justification_ux
        existing.justification_support = data.justification_support
        if data.scoring_criteria is not None:
            existing.scoring_criteria = data.scoring_criteria
        existing.last_updated = date.fromisoformat(data.last_updated) if data.last_updated else date.today()
        product = existing
    else:
        product = Product(
            id=product_id,
            name=data.name,
            type=data.type,
            tagline=data.tagline,
            description=data.description,
            url=data.url,
            logo=data.logo or "",
            tags=data.tags,
            audience=data.audience,
            problems_solved=data.problems_solved,
            preference_match=data.preference_match,
            is_mentaltech_member=data.is_mentaltech_member,
            pricing_model=data.pricing_model,
            pricing_amount=data.pricing_amount,
            pricing_details=data.pricing_details,
            last_updated=date.fromisoformat(data.last_updated) if data.last_updated else date.today(),
            score_security=data.score_security,
            score_efficacy=data.score_efficacy,
            score_accessibility=data.score_accessibility,
            score_ux=data.score_ux,
            score_support=data.score_support,
            justification_security=data.justification_security,
            justification_efficacy=data.justification_efficacy,
            justification_accessibility=data.justification_accessibility,
            justification_ux=data.justification_ux,
            justification_support=data.justification_support,
            scoring_criteria=data.scoring_criteria,
        )
        db.add(product)

    db.commit()
    db.refresh(product)

    return product_to_response(product)


# ─── SUBMISSION HELPERS ─────────────────────────────────────

def _sub_to_response(sub: ProductSubmission) -> SubmissionResponse:
    return SubmissionResponse(
        id=str(sub.id),
        publisherId=str(sub.publisher_id),
        productId=sub.product_id,
        status=sub.status,
        name=sub.name,
        type=sub.type,
        tagline=sub.tagline,
        description=sub.description,
        url=sub.url,
        logo=sub.logo,
        tags=sub.tags or [],
        audience=sub.audience or [],
        problemsSolved=sub.problems_solved or [],
        pricingModel=sub.pricing_model,
        pricingAmount=sub.pricing_amount,
        pricingDetails=sub.pricing_details,
        protocolAnswers=sub.protocol_answers or {},
        adminNotes=sub.admin_notes,
        reviewedAt=sub.reviewed_at.isoformat() if sub.reviewed_at else None,
        createdAt=sub.created_at.isoformat(),
        updatedAt=sub.updated_at.isoformat(),
    )


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[àâä]', 'a', text)
    text = re.sub(r'[éèêë]', 'e', text)
    text = re.sub(r'[ïî]', 'i', text)
    text = re.sub(r'[ôö]', 'o', text)
    text = re.sub(r'[ùûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text[:100]


# ─── SUBMISSIONS MANAGEMENT ─────────────────────────────────

@router.get("/submissions", response_model=list[SubmissionResponse])
def list_submissions(
    status_filter: str | None = Query(default=None, alias="status"),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(ProductSubmission)
    if status_filter:
        query = query.filter(ProductSubmission.status == status_filter)
    submissions = query.order_by(ProductSubmission.created_at.desc()).all()
    return [_sub_to_response(s) for s in submissions]


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(ProductSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")
    return _sub_to_response(submission)


@router.post("/submissions/{submission_id}/approve", response_model=SubmissionResponse)
def approve_submission(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(ProductSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.status not in ("submitted", "under_review"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seules les soumissions en attente de review peuvent être approuvées",
        )

    # Create or update product
    if submission.product_id:
        product = db.query(Product).filter(Product.id == submission.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit lié introuvable")
    else:
        product_id = _slugify(submission.name or "solution")
        # Ensure unique id
        existing = db.query(Product).filter(Product.id == product_id).first()
        if existing:
            product_id = f"{product_id}-{uuid.uuid4().hex[:6]}"
        product = Product(id=product_id)
        db.add(product)

    # Set product fields from submission
    product.name = submission.name or "Sans titre"
    product.type = submission.type or "Autre"
    product.tagline = submission.tagline or ""
    product.description = submission.description or ""
    product.url = submission.url or ""
    product.logo = submission.logo or ""
    product.tags = submission.tags or []
    product.audience = submission.audience or []
    product.problems_solved = submission.problems_solved or []
    product.pricing_model = submission.pricing_model
    product.pricing_amount = submission.pricing_amount
    product.pricing_details = submission.pricing_details

    # Set scores from review
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

    # Update submission
    submission.status = "approved"
    submission.admin_notes = data.admin_notes
    submission.admin_id = admin.id
    submission.reviewed_at = datetime.now(timezone.utc)
    submission.product_id = product.id
    submission.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(submission)
    return _sub_to_response(submission)


@router.post("/submissions/{submission_id}/reject", response_model=SubmissionResponse)
def reject_submission(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(ProductSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.status not in ("submitted", "under_review"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seules les soumissions en attente de review peuvent être rejetées",
        )

    submission.status = "rejected"
    submission.admin_notes = data.admin_notes
    submission.admin_id = admin.id
    submission.reviewed_at = datetime.now(timezone.utc)
    submission.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(submission)
    return _sub_to_response(submission)


@router.post("/submissions/{submission_id}/request-changes", response_model=SubmissionResponse)
def request_changes(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(ProductSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.status not in ("submitted", "under_review"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seules les soumissions en attente de review peuvent recevoir des demandes de modifications",
        )

    submission.status = "changes_requested"
    submission.admin_notes = data.admin_notes
    submission.admin_id = admin.id
    submission.reviewed_at = datetime.now(timezone.utc)
    submission.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(submission)
    return _sub_to_response(submission)


# ─── PUBLISHER VALIDATION ───────────────────────────────────

@router.get("/publishers", response_model=list[PublisherListItem])
def list_publishers(
    pending_only: bool = Query(default=False),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role == "publisher")
    if pending_only:
        query = query.filter(User.is_verified_publisher == False)
    publishers = query.order_by(User.created_at.desc()).all()

    return [
        PublisherListItem(
            id=str(p.id),
            email=p.email,
            name=p.name,
            company_name=p.company_name,
            siret=p.siret,
            company_website=p.company_website,
            is_verified_publisher=p.is_verified_publisher,
            created_at=p.created_at.isoformat(),
        )
        for p in publishers
    ]


@router.post("/publishers/{publisher_id}/verify")
async def verify_publisher(
    publisher_id: str,
    background_tasks: BackgroundTasks,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == publisher_id, User.role == "publisher").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Éditeur introuvable")

    user.is_verified_publisher = True
    db.commit()

    dashboard_url = f"{settings.FRONTEND_URL}/publisher"
    background_tasks.add_task(
        send_publisher_approved_email,
        email=user.email,
        name=user.name,
        dashboard_url=dashboard_url,
    )

    return {"message": f"Éditeur {user.name} validé avec succès"}


@router.post("/publishers/{publisher_id}/reject")
def reject_publisher(
    publisher_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == publisher_id, User.role == "publisher").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Éditeur introuvable")

    user.is_verified_publisher = False
    db.commit()

    return {"message": f"Éditeur {user.name} refusé"}
