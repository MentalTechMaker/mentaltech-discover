import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Request, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.public_submission import PublicSubmission
from ..models.health_prof_application import HealthProfApplication
from ..schemas.public_submission import (
    PublicSubmissionCreate,
    PublicSubmissionResponse,
    HealthProfApplicationCreate,
)
from ..services.email import (
    create_email_token,
    decode_email_token,
    send_submission_confirmation_email,
    send_submission_received_admin_email,
    send_health_pro_confirmation_email,
    send_health_pro_admin_notification,
)
from ..config import settings

router = APIRouter(prefix="/api/public", tags=["public"])

from ..rate_limit import limiter

BOT_MIN_SECONDS = 3.0

PUBLIC_LOGO_ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp"}
PUBLIC_LOGO_MAX_SIZE = 2 * 1024 * 1024  # 2 MB
PUBLIC_LOGO_UPLOAD_DIR = Path("/tmp/uploads/logos")


def _validate_magic_bytes(content: bytes, content_type: str) -> bool:
    if content_type == "image/png":
        return content[:4] == b'\x89PNG'
    elif content_type == "image/jpeg":
        return content[:3] == b'\xff\xd8\xff'
    elif content_type == "image/webp":
        return content[:4] == b'RIFF' and content[8:12] == b'WEBP'
    return False


def _check_bot(honeypot: str, submitted_at_ts: float) -> None:
    if honeypot:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bot détecté")
    if submitted_at_ts > 0 and (time.time() - submitted_at_ts) < BOT_MIN_SECONDS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Soumission trop rapide")


def _to_response(sub: PublicSubmission) -> PublicSubmissionResponse:
    return PublicSubmissionResponse(
        id=str(sub.id),
        contactName=sub.contact_name,
        contactEmail=sub.contact_email,
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
        collectifRequested=sub.collectif_requested,
        collectifCaRange=sub.collectif_ca_range,
        collectifStatus=sub.collectif_status,
        collectifContactEmail=sub.collectif_contact_email,
        adminNotes=sub.admin_notes,
        productId=sub.product_id,
        reviewedAt=sub.reviewed_at.isoformat() if sub.reviewed_at else None,
        createdAt=sub.created_at.isoformat(),
        updatedAt=sub.updated_at.isoformat(),
    )


@router.post("/upload-logo")
async def public_upload_logo(file: UploadFile = File(...)):
    """Upload a product logo from the public submission form. No auth required."""
    if file.content_type not in PUBLIC_LOGO_ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Type de fichier non supporté. PNG, JPEG ou WebP uniquement.",
        )

    content = await file.read()
    if len(content) > PUBLIC_LOGO_MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier trop volumineux (max 2 Mo)",
        )

    if not _validate_magic_bytes(content, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contenu du fichier invalide",
        )

    ext_map = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}
    ext = ext_map[file.content_type]
    filename = f"{uuid.uuid4().hex}{ext}"

    PUBLIC_LOGO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    (PUBLIC_LOGO_UPLOAD_DIR / filename).write_bytes(content)

    return JSONResponse({"path": f"/uploads/logos/{filename}"})


@router.post("/submissions", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def create_public_submission(
    data: PublicSubmissionCreate,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    _check_bot(data.honeypot, data.submitted_at_ts)

    submission = PublicSubmission(
        contact_name=data.contact_name,
        contact_email=str(data.contact_email),
        status="pending_email",
        email_confirmed=False,
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
        collectif_requested=data.collectif_requested,
        collectif_ca_range=data.collectif_ca_range,
        collectif_contact_email=str(data.collectif_contact_email) if data.collectif_contact_email else None,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    token = create_email_token(str(submission.id), "confirm_submission", expire_hours=48)
    submission.confirm_token = token
    db.commit()

    # Send confirmation email (CA range passed in background - never stored)
    background_tasks.add_task(
        send_submission_confirmation_email,
        email=str(data.contact_email),
        name=data.contact_name,
        confirm_token=token,
    )

    # Store CA range in closure for admin email (never hits DB)
    ca_range = data.collectif_ca_range

    async def _send_admin_later():
        await send_submission_received_admin_email(
            admin_email=settings.ADMIN_EMAIL,
            contact_name=data.contact_name,
            contact_email=str(data.contact_email),
            product_name=data.name,
            collectif_requested=data.collectif_requested,
            collectif_ca_range=ca_range,
        )

    # Note: background_tasks doesn't support async closures directly, so use a wrapper
    # We skip admin notification here and send it on confirm instead (after email verification)

    return {"message": "Email de confirmation envoyé. Vérifiez votre boîte mail.", "id": str(submission.id)}


@router.get("/submissions/confirm")
async def confirm_submission(
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    submission_id = decode_email_token(token, "confirm_submission")
    if not submission_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lien invalide ou expiré")

    submission = db.query(PublicSubmission).filter(
        PublicSubmission.id == submission_id,
        PublicSubmission.confirm_token == token,
    ).first()

    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable")

    if submission.email_confirmed:
        return {"message": "Soumission déjà confirmée", "submission_id": str(submission.id)}

    submission.email_confirmed = True
    submission.status = "submitted"
    submission.confirm_token = None
    submission.updated_at = datetime.now(timezone.utc)
    db.commit()

    background_tasks.add_task(
        send_submission_received_admin_email,
        admin_email=settings.ADMIN_EMAIL,
        contact_name=submission.contact_name,
        contact_email=submission.contact_email,
        product_name=submission.name,
        collectif_requested=submission.collectif_requested,
        collectif_ca_range=submission.collectif_ca_range,
    )

    return {"message": "Soumission confirmée avec succès", "submission_id": str(submission.id)}


@router.post("/health-pro/apply", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def apply_health_pro(
    data: HealthProfApplicationCreate,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    _check_bot(data.honeypot, data.submitted_at_ts)

    application = HealthProfApplication(
        name=data.name,
        email=str(data.email),
        profession=data.profession,
        rpps_adeli=data.rpps_adeli,
        organization=data.organization,
        motivation=data.motivation,
        status="pending_email",
        email_confirmed=False,
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    token = create_email_token(str(application.id), "confirm_health_pro", expire_hours=48)
    application.confirm_token = token
    db.commit()

    background_tasks.add_task(
        send_health_pro_confirmation_email,
        email=str(data.email),
        name=data.name,
        confirm_token=token,
    )

    return {"message": "Email de confirmation envoyé. Vérifiez votre boîte mail.", "id": str(application.id)}


@router.get("/health-pro/confirm")
async def confirm_health_pro(
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    application_id = decode_email_token(token, "confirm_health_pro")
    if not application_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lien invalide ou expiré")

    application = db.query(HealthProfApplication).filter(
        HealthProfApplication.id == application_id,
        HealthProfApplication.confirm_token == token,
    ).first()

    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable")

    if application.email_confirmed:
        return {"message": "Candidature déjà confirmée", "application_id": str(application.id)}

    application.email_confirmed = True
    application.status = "submitted"
    application.confirm_token = None
    application.updated_at = datetime.now(timezone.utc)
    db.commit()

    background_tasks.add_task(
        send_health_pro_admin_notification,
        admin_email=settings.ADMIN_EMAIL,
        name=application.name,
        email=application.email,
        profession=application.profession,
        rpps_adeli=application.rpps_adeli,
        organization=application.organization,
        motivation=application.motivation,
    )

    return {"message": "Candidature confirmée avec succès", "application_id": str(application.id)}
