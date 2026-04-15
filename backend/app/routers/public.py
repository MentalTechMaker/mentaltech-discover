import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..utils import to_dict, validate_magic_bytes, public_submission_to_response
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
    send_submission_recap_email,
)
from ..config import settings

router = APIRouter(prefix="/api/public", tags=["public"])

from ..rate_limit import limiter

BOT_MIN_SECONDS = 3.0

PUBLIC_LOGO_ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp"}
PUBLIC_LOGO_MAX_SIZE = 2 * 1024 * 1024  # 2 MB
PUBLIC_LOGO_UPLOAD_DIR = Path("/tmp/uploads/logos")


_validate_magic_bytes = validate_magic_bytes


def _check_bot(honeypot: str, submitted_at_ts: float) -> None:
    if honeypot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Bot détecté"
        )
    if submitted_at_ts > 0 and (time.time() - submitted_at_ts) < BOT_MIN_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Soumission trop rapide"
        )


_to_response = public_submission_to_response


def _populate_submission_fields(
    submission: PublicSubmission, data: PublicSubmissionCreate
) -> None:
    submission.contact_name = data.contact_name
    submission.contact_email = str(data.contact_email)
    submission.name = data.name
    submission.tagline = data.tagline
    submission.description = data.description
    submission.url = data.url
    submission.linkedin = data.linkedin
    submission.logo = data.logo
    submission.tags = data.tags
    submission.audience = data.audience
    submission.problems_solved = data.problems_solved
    submission.audience_priorities = to_dict(data.audience_priorities)
    submission.problems_priorities = to_dict(data.problems_priorities)
    submission.preference_match = data.preference_match
    submission.pricing_model = data.pricing_model
    submission.pricing_amount = data.pricing_amount
    submission.pricing_details = data.pricing_details
    submission.protocol_answers = data.protocol_answers
    submission.collectif_requested = data.collectif_requested
    submission.collectif_ca_range = data.collectif_ca_range
    submission.collectif_contact_email = (
        str(data.collectif_contact_email) if data.collectif_contact_email else None
    )


def _populate_health_pro_fields(
    application: HealthProfApplication, data: HealthProfApplicationCreate
) -> None:
    application.name = data.name
    application.email = str(data.email)
    application.profession = data.profession
    application.rpps_adeli = data.rpps_adeli
    application.organization = data.organization
    application.motivation = data.motivation
    application.linkedin = data.linkedin


@router.post("/upload-logo")
@limiter.limit("5/hour")
async def public_upload_logo(request: Request, file: UploadFile = File(...)):
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
    request: Request,
    db: Session = Depends(get_db),
):
    _check_bot(data.honeypot, data.submitted_at_ts)

    email_lower = str(data.contact_email).lower().strip()
    name_lower = (data.name or "").lower().strip()

    existing = (
        db.query(PublicSubmission)
        .filter(
            func.lower(func.trim(PublicSubmission.contact_email)) == email_lower,
            func.lower(func.trim(func.coalesce(PublicSubmission.name, ""))) == name_lower,
        )
        .first()
    )

    if existing and existing.email_confirmed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette solution a déjà été soumise avec cette adresse email. Contactez-nous si besoin.",
        )

    if existing:
        submission = existing
    else:
        # collectif_ca_range stored temporarily for admin review, purged on approval/rejection
        submission = PublicSubmission(status="pending_email", email_confirmed=False)
        db.add(submission)

    _populate_submission_fields(submission, data)

    db.commit()
    db.refresh(submission)

    token = create_email_token(
        str(submission.id), "confirm_submission", expire_hours=48
    )
    submission.confirm_token = token
    db.commit()

    # Send confirmation email
    email_sent = await send_submission_confirmation_email(
        email=str(data.contact_email),
        name=data.contact_name,
        confirm_token=token,
    )

    return {
        "message": f"Email de confirmation {'renvoyé' if existing else 'envoyé'}. Vérifiez votre boîte mail.",
        "id": str(submission.id),
        "email_sent": email_sent,
    }


@router.get("/submissions/confirm")
async def confirm_submission(
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    submission_id = decode_email_token(token, "confirm_submission")
    if not submission_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Lien invalide ou expiré"
        )

    submission = (
        db.query(PublicSubmission)
        .filter(
            PublicSubmission.id == submission_id,
            PublicSubmission.confirm_token == token,
        )
        .first()
    )

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Soumission introuvable"
        )

    if submission.email_confirmed:
        return {
            "message": "Soumission déjà confirmée",
            "submission_id": str(submission.id),
        }

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

    background_tasks.add_task(
        send_submission_recap_email,
        email=submission.contact_email,
        contact_name=submission.contact_name,
        product_name=submission.name,
        product_type=None,
        tagline=submission.tagline,
        url=submission.url,
        audience_priorities=submission.audience_priorities,
        problems_priorities=submission.problems_priorities,
        pricing_model=submission.pricing_model,
        pricing_amount=submission.pricing_amount,
        collectif_requested=submission.collectif_requested,
    )

    return {
        "message": "Soumission confirmee avec succes",
        "submission_id": str(submission.id),
    }


@router.post("/health-pro/apply", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
async def apply_health_pro(
    data: HealthProfApplicationCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    _check_bot(data.honeypot, data.submitted_at_ts)

    email_lower = str(data.email).lower().strip()

    existing = (
        db.query(HealthProfApplication)
        .filter(func.lower(func.trim(HealthProfApplication.email)) == email_lower)
        .first()
    )

    if existing and existing.email_confirmed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Une candidature a déjà été déposée avec cette adresse email. Contactez-nous si besoin.",
        )

    if existing:
        application = existing
    else:
        application = HealthProfApplication(status="pending_email", email_confirmed=False)
        db.add(application)

    _populate_health_pro_fields(application, data)

    db.commit()
    db.refresh(application)

    token = create_email_token(
        str(application.id), "confirm_health_pro", expire_hours=48
    )
    application.confirm_token = token
    db.commit()

    email_sent = await send_health_pro_confirmation_email(
        email=str(data.email),
        name=data.name,
        confirm_token=token,
    )

    return {
        "message": f"Email de confirmation {'renvoyé' if existing else 'envoyé'}. Vérifiez votre boîte mail.",
        "id": str(application.id),
        "email_sent": email_sent,
    }


@router.get("/health-pro/confirm")
async def confirm_health_pro(
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    application_id = decode_email_token(token, "confirm_health_pro")
    if not application_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Lien invalide ou expiré"
        )

    application = (
        db.query(HealthProfApplication)
        .filter(
            HealthProfApplication.id == application_id,
            HealthProfApplication.confirm_token == token,
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Candidature introuvable"
        )

    if application.email_confirmed:
        return {
            "message": "Candidature déjà confirmée",
            "application_id": str(application.id),
        }

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

    return {
        "message": "Candidature confirmée avec succès",
        "application_id": str(application.id),
    }
