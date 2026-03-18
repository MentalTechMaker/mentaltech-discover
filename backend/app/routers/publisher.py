from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_publisher
from ..models.user import User
from ..models.product_submission import ProductSubmission
from ..schemas.publisher import SubmissionCreate, SubmissionUpdate, SubmissionResponse

router = APIRouter(prefix="/api/publisher", tags=["publisher"])


def _to_response(sub: ProductSubmission) -> SubmissionResponse:
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
        forCompany=sub.for_company or False,
        pricingModel=sub.pricing_model,
        pricingAmount=sub.pricing_amount,
        pricingDetails=sub.pricing_details,
        protocolAnswers=sub.protocol_answers or {},
        adminNotes=sub.admin_notes,
        reviewedAt=sub.reviewed_at.isoformat() if sub.reviewed_at else None,
        createdAt=sub.created_at.isoformat(),
        updatedAt=sub.updated_at.isoformat(),
    )


@router.get("/submissions", response_model=list[SubmissionResponse])
def list_submissions(
    user: User = Depends(require_publisher),
    db: Session = Depends(get_db),
):
    submissions = (
        db.query(ProductSubmission)
        .filter(ProductSubmission.publisher_id == user.id)
        .order_by(ProductSubmission.updated_at.desc())
        .all()
    )
    return [_to_response(s) for s in submissions]


@router.post("/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(
    data: SubmissionCreate,
    user: User = Depends(require_publisher),
    db: Session = Depends(get_db),
):
    submission = ProductSubmission(
        publisher_id=user.id,
        status="draft",
        name=data.name,
        type=data.type,
        tagline=data.tagline,
        description=data.description,
        url=data.url,
        logo=data.logo,
        tags=data.tags,
        audience=data.audience,
        problems_solved=data.problems_solved,
        for_company=data.for_company,
        pricing_model=data.pricing_model,
        pricing_amount=data.pricing_amount,
        pricing_details=data.pricing_details,
        protocol_answers=data.protocol_answers,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return _to_response(submission)


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    user: User = Depends(require_publisher),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(
        ProductSubmission.id == submission_id,
        ProductSubmission.publisher_id == user.id,
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")
    return _to_response(submission)


@router.put("/submissions/{submission_id}", response_model=SubmissionResponse)
def update_submission(
    submission_id: str,
    data: SubmissionUpdate,
    user: User = Depends(require_publisher),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(
        ProductSubmission.id == submission_id,
        ProductSubmission.publisher_id == user.id,
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.status not in ("draft", "changes_requested"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seuls les brouillons ou soumissions avec demande de modifications peuvent être modifiés",
        )

    # Update only provided fields
    if data.name is not None:
        submission.name = data.name
    if data.type is not None:
        submission.type = data.type
    if data.tagline is not None:
        submission.tagline = data.tagline
    if data.description is not None:
        submission.description = data.description
    if data.url is not None:
        submission.url = data.url
    if data.logo is not None:
        submission.logo = data.logo
    if data.tags is not None:
        submission.tags = data.tags
    if data.audience is not None:
        submission.audience = data.audience
    if data.problems_solved is not None:
        submission.problems_solved = data.problems_solved
    if data.for_company is not None:
        submission.for_company = data.for_company
    if data.pricing_model is not None:
        submission.pricing_model = data.pricing_model
    if data.pricing_amount is not None:
        submission.pricing_amount = data.pricing_amount
    if data.pricing_details is not None:
        submission.pricing_details = data.pricing_details
    if data.protocol_answers is not None:
        submission.protocol_answers = data.protocol_answers

    submission.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(submission)
    return _to_response(submission)


@router.post("/submissions/{submission_id}/submit", response_model=SubmissionResponse)
def submit_for_review(
    submission_id: str,
    user: User = Depends(require_publisher),
    db: Session = Depends(get_db),
):
    submission = db.query(ProductSubmission).filter(
        ProductSubmission.id == submission_id,
        ProductSubmission.publisher_id == user.id,
    ).first()
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.status not in ("draft", "changes_requested"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seuls les brouillons ou soumissions avec demande de modifications peuvent être soumis",
        )

    # Validate required fields
    errors = []
    if not submission.name:
        errors.append("Le nom est requis")
    if not submission.description:
        errors.append("La description est requise")
    if not submission.url:
        errors.append("L'URL est requise")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors),
        )

    submission.status = "submitted"
    submission.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(submission)
    return _to_response(submission)
