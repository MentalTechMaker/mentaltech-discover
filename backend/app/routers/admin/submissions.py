import uuid
from datetime import date, datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from ...utils import to_dict
from ...database import get_db
from ...dependencies import require_admin
from ...models.user import User
from ...models.product import Product
from ...models.product_submission import ProductSubmission
from ...schemas.publisher import (
    AdminCreateAndPublishSchema,
    AdminReviewAction,
    SubmissionResponse,
)
from ...schemas.product import ProductResponse
from ...services.product import _to_response as product_to_response
from .helpers import _slugify, _sub_to_response

router = APIRouter(tags=["admin"])


# ---- ADMIN CREATE AND PUBLISH ----


@router.post(
    "/submissions/create-and-publish",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
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
        tagline=data.tagline,
        description=data.description,
        url=data.url,
        logo=data.logo,
        tags=data.tags,
        audience=data.audience,
        problems_solved=data.problems_solved,
        audience_priorities=to_dict(data.audience_priorities),
        problems_priorities=to_dict(data.problems_priorities),
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
        existing.tagline = data.tagline
        existing.description = data.description
        existing.url = data.url
        if data.logo:
            existing.logo = data.logo
        existing.tags = data.tags
        existing.audience = data.audience
        existing.problems_solved = data.problems_solved
        existing.audience_priorities = to_dict(data.audience_priorities)
        existing.problems_priorities = to_dict(data.problems_priorities)
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
        existing.last_updated = (
            date.fromisoformat(data.last_updated) if data.last_updated else date.today()
        )
        product = existing
    else:
        product = Product(
            id=product_id,
            name=data.name,
            tagline=data.tagline,
            description=data.description,
            url=data.url,
            logo=data.logo or "",
            tags=data.tags,
            audience=data.audience,
            problems_solved=data.problems_solved,
            audience_priorities=to_dict(data.audience_priorities),
            problems_priorities=to_dict(data.problems_priorities),
            preference_match=data.preference_match,
            is_mentaltech_member=data.is_mentaltech_member,
            pricing_model=data.pricing_model,
            pricing_amount=data.pricing_amount,
            pricing_details=data.pricing_details,
            last_updated=(
                date.fromisoformat(data.last_updated)
                if data.last_updated
                else date.today()
            ),
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
            is_visible=False,
        )
        db.add(product)

    db.commit()
    db.refresh(product)

    return product_to_response(product, include_scoring=True)


# ---- SUBMISSIONS MANAGEMENT ----


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
    submission = (
        db.query(ProductSubmission)
        .filter(ProductSubmission.id == submission_id)
        .first()
    )
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )
    return _sub_to_response(submission)


@router.post("/submissions/{submission_id}/approve", response_model=SubmissionResponse)
def approve_submission(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = (
        db.query(ProductSubmission)
        .filter(ProductSubmission.id == submission_id)
        .first()
    )
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    if submission.status not in ("submitted", "under_review"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seules les soumissions en attente de review peuvent être approuvées",
        )

    # Create or update product
    if submission.product_id:
        product = db.query(Product).filter(Product.id == submission.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produit lié introuvable"
            )
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
    product.tagline = submission.tagline or ""
    product.description = submission.description or ""
    product.url = submission.url or ""
    product.logo = submission.logo or ""
    product.tags = submission.tags or []
    product.audience = submission.audience or []
    product.problems_solved = submission.problems_solved or []
    product.audience_priorities = submission.audience_priorities or {}
    product.problems_priorities = submission.problems_priorities or {}
    product.preference_match = submission.preference_match or []
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
    submission = (
        db.query(ProductSubmission)
        .filter(ProductSubmission.id == submission_id)
        .first()
    )
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

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


@router.post(
    "/submissions/{submission_id}/request-changes", response_model=SubmissionResponse
)
def request_changes(
    submission_id: str,
    data: AdminReviewAction,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    submission = (
        db.query(ProductSubmission)
        .filter(ProductSubmission.id == submission_id)
        .first()
    )
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

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
