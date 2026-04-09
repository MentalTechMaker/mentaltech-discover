import logging
from pathlib import Path
from datetime import datetime, timedelta, timezone

from fastapi_mail import FastMail, MessageSchema, MessageType, ConnectionConfig
import jwt
from jwt.exceptions import PyJWTError
from jinja2 import Environment, FileSystemLoader

from ..config import settings
from ..services.auth import ALGORITHM

logger = logging.getLogger(__name__)


def _mask_email(email: str) -> str:
    """Mask email for RGPD-compliant logging: a***@example.com"""
    if "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    return f"{local[0]}***@{domain}"


TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
EMAIL_DEV_DIR = Path("/tmp/mentaltech_emails")

jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)), autoescape=True)
jinja_env.globals["frontend_url"] = settings.FRONTEND_URL

mail_conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=bool(settings.MAIL_USERNAME),
    VALIDATE_CERTS=True,
)

fm = FastMail(mail_conf)


def _write_email_to_file(subject: str, recipients: list[str], html: str) -> bool:
    """Écrit le contenu d'un email dans un fichier local (dev uniquement)."""
    if not settings.DEBUG:
        logger.warning(
            "Email send failed in production - file fallback disabled for security"
        )
        return False
    try:
        EMAIL_DEV_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        safe_recipient = recipients[0].replace("@", "_at_").replace(".", "_")
        filepath = EMAIL_DEV_DIR / f"{timestamp}_{safe_recipient}.html"
        content = (
            f"<!-- Subject: {subject} -->\n"
            f"<!-- To: {', '.join(recipients)} -->\n"
            f"<!-- Sent: {datetime.now().isoformat()} -->\n\n"
            f"{html}"
        )
        filepath.write_text(content, encoding="utf-8")
        logger.info(f"[DEV] Email écrit dans le fichier : {filepath}")
        return True
    except Exception:
        logger.error("Impossible d'écrire l'email dans le fichier", exc_info=True)
        return False


async def _send_or_write(message: MessageSchema, recipients: list[str], html: str, label: str) -> bool:
    """En DEBUG, écrit dans un fichier. En production, envoie via SMTP."""
    if settings.DEBUG:
        logger.info(f"[DEV] {label} - mode debug, écriture fichier")
        return _write_email_to_file(message.subject, recipients, html)
    try:
        await fm.send_message(message)
        logger.info(f"{label} sent to {_mask_email(recipients[0])}")
        return True
    except Exception:
        logger.error(f"Failed to send {label} to {_mask_email(recipients[0])}", exc_info=True)
        _write_email_to_file(message.subject, recipients, html)
        return False


def create_email_token(user_id: str, purpose: str, expire_hours: int = 24) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=expire_hours)
    payload = {"sub": user_id, "exp": expire, "iat": now, "type": purpose}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_email_token(
    token: str, expected_purpose: str, return_full: bool = False
) -> str | dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != expected_purpose:
            return None
        if return_full:
            return payload
        return payload.get("sub")
    except (PyJWTError, ValueError, KeyError):
        return None


async def send_verification_email(email: str, name: str, user_id: str) -> bool:
    token = create_email_token(user_id, "verify_email", expire_hours=24)
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    template = jinja_env.get_template("verify_email.html")
    html = template.render(name=name, verify_url=verify_url)

    message = MessageSchema(
        subject="Vérifiez votre adresse email - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )

    return await _send_or_write(message, [email], html, "Verification email")


async def send_prescription_email(
    patient_email: str,
    prescriber_name: str,
    prescriber_profession: str | None,
    prescriber_organization: str | None,
    link: str,
    product_names: list[str],
    message: str | None,
    expires_at: str,
) -> bool:
    template = jinja_env.get_template("prescription.html")
    html = template.render(
        prescriber_name=prescriber_name,
        prescriber_profession=prescriber_profession,
        prescriber_organization=prescriber_organization,
        link=link,
        products=product_names,
        message=message,
        expires_at=expires_at,
    )

    message_schema = MessageSchema(
        subject=f"Prescription numérique de {prescriber_name} - MentalTech Discover",
        recipients=[patient_email],
        body=html,
        subtype=MessageType.html,
    )

    return await _send_or_write(message_schema, [patient_email], html, "Prescription email")


async def send_prescription_viewed_email(
    prescriber_email: str,
    prescriber_name: str,
    prescription_link: str,
) -> bool:
    template = jinja_env.get_template("prescription_viewed.html")
    html = template.render(
        prescriber_name=prescriber_name,
        prescription_link=prescription_link,
    )
    message = MessageSchema(
        subject="Votre prescription a été consultée - MentalTech Discover",
        recipients=[prescriber_email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [prescriber_email], html, "Prescription viewed email")

async def send_prescription_revoked_email(
    prescriber_email: str,
    prescriber_name: str,
    dashboard_url: str,
) -> bool:
    template = jinja_env.get_template("prescription_revoked.html")
    html = template.render(
        prescriber_name=prescriber_name,
        dashboard_url=dashboard_url,
    )
    message = MessageSchema(
        subject="Une prescription a été supprimée (RGPD) - MentalTech Discover",
        recipients=[prescriber_email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [prescriber_email], html, "Prescription revoked email")


async def send_prescriber_approved_email(
    email: str, name: str, dashboard_url: str
) -> bool:
    template = jinja_env.get_template("prescriber_approved.html")
    html = template.render(name=name, dashboard_url=dashboard_url)
    message = MessageSchema(
        subject="Votre compte prescripteur est validé - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Prescriber approved email")

async def send_submission_confirmation_email(
    email: str, name: str, confirm_token: str
) -> bool:
    confirm_url = f"{settings.FRONTEND_URL}/confirmer-soumission?token={confirm_token}"
    template = jinja_env.get_template("submission_confirmation.html")
    html = template.render(name=name, confirm_url=confirm_url)
    message = MessageSchema(
        subject="Confirmez votre demande de référencement - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Submission confirmation email")

async def send_submission_recap_email(
    email: str,
    contact_name: str,
    product_name: str | None,
    product_type: str | None,
    tagline: str | None,
    url: str | None,
    audience_priorities: dict | None,
    problems_priorities: dict | None,
    pricing_model: str | None,
    pricing_amount: str | None,
    collectif_requested: bool,
) -> bool:
    template = jinja_env.get_template("submission_recap.html")
    ap = audience_priorities or {}
    pp = problems_priorities or {}
    html = template.render(
        contact_name=contact_name,
        product_name=product_name,
        product_type=product_type,
        tagline=tagline,
        url=url,
        audience_p1=ap.get("P1", []),
        audience_p2=ap.get("P2", []),
        audience_p3=ap.get("P3", []),
        problems_p1=pp.get("P1", []),
        problems_p2=pp.get("P2", []),
        problems_p3=pp.get("P3", []),
        pricing_model=pricing_model,
        pricing_amount=pricing_amount,
        collectif_requested=collectif_requested,
        frontend_url=settings.FRONTEND_URL,
    )
    message = MessageSchema(
        subject="Recapitulatif de votre soumission - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Submission recap email")

async def send_submission_received_admin_email(
    admin_email: str,
    contact_name: str,
    contact_email: str,
    product_name: str | None,
    collectif_requested: bool,
    collectif_ca_range: str | None,
) -> bool:
    admin_url = f"{settings.FRONTEND_URL}/admin"
    template = jinja_env.get_template("admin_submission_received.html")
    html = template.render(
        contact_name=contact_name,
        contact_email=contact_email,
        product_name=product_name,
        collectif_requested=collectif_requested,
        collectif_ca_range=collectif_ca_range,
        admin_url=admin_url,
    )
    message = MessageSchema(
        subject=f"Nouvelle soumission : {product_name or contact_name} - MentalTech Discover",
        recipients=[admin_email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [admin_email], html, "Admin submission notification")

async def send_submission_approved_email(
    email: str, name: str, product_name: str | None
) -> bool:
    catalog_url = f"{settings.FRONTEND_URL}/catalogue"
    template = jinja_env.get_template("submission_approved.html")
    html = template.render(
        name=name, product_name=product_name, catalog_url=catalog_url
    )
    message = MessageSchema(
        subject="Votre solution a été acceptée ! - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Submission approved email")

async def send_submission_rejected_email(
    email: str, name: str, product_name: str | None, admin_notes: str | None
) -> bool:
    template = jinja_env.get_template("submission_rejected.html")
    html = template.render(
        name=name, product_name=product_name, admin_notes=admin_notes
    )
    message = MessageSchema(
        subject="Réponse à votre demande de référencement - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Submission rejected email")

async def send_collectif_invite_email(
    email: str, name: str, helloasso_url: str
) -> bool:
    template = jinja_env.get_template("collectif_invite.html")
    html = template.render(name=name, helloasso_url=helloasso_url)
    message = MessageSchema(
        subject="Bienvenue dans le Collectif MentalTech !",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Collectif invite email")

async def send_collectif_refused_email(
    email: str, name: str, admin_notes: str | None
) -> bool:
    template = jinja_env.get_template("collectif_refused.html")
    html = template.render(name=name, admin_notes=admin_notes)
    message = MessageSchema(
        subject="Réponse à votre candidature au Collectif MentalTech",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Collectif refused email")

async def send_health_pro_confirmation_email(
    email: str, name: str, confirm_token: str
) -> bool:
    confirm_url = f"{settings.FRONTEND_URL}/confirmer-candidature?token={confirm_token}"
    template = jinja_env.get_template("health_pro_confirmation.html")
    html = template.render(name=name, confirm_url=confirm_url)
    message = MessageSchema(
        subject="Confirmez votre candidature au Collectif MentalTech",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [email], html, "Health pro confirmation email")

async def send_health_pro_admin_notification(
    admin_email: str,
    name: str,
    email: str,
    profession: str,
    rpps_adeli: str | None = None,
    organization: str | None = None,
    motivation: str | None = None,
) -> bool:
    admin_url = f"{settings.FRONTEND_URL}/admin"
    template = jinja_env.get_template("admin_health_pro_received.html")
    html = template.render(
        name=name,
        email=email,
        profession=profession,
        rpps_adeli=rpps_adeli,
        organization=organization,
        motivation=motivation,
        admin_url=admin_url,
    )
    message = MessageSchema(
        subject=f"Nouvelle candidature professionnelle : {name} - MentalTech Discover",
        recipients=[admin_email],
        body=html,
        subtype=MessageType.html,
    )
    return await _send_or_write(message, [admin_email], html, "Health pro admin notification")

async def send_reset_password_email(email: str, name: str, user_id: str) -> bool:
    token = create_email_token(user_id, "reset_password", expire_hours=1)
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    template = jinja_env.get_template("reset_password.html")
    html = template.render(name=name, reset_url=reset_url)

    message = MessageSchema(
        subject="Réinitialisation de mot de passe - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )

    return await _send_or_write(message, [email], html, "Password reset email")
