import logging
from pathlib import Path
from datetime import datetime, timedelta, timezone

from fastapi_mail import FastMail, MessageSchema, MessageType, ConnectionConfig
from jose import jwt, JWTError
from jinja2 import Environment, FileSystemLoader

from ..config import settings
from ..services.auth import ALGORITHM

logger = logging.getLogger(__name__)

TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
EMAIL_DEV_DIR = Path("/tmp/mentaltech_emails")

jinja_env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))

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


def _write_email_to_file(subject: str, recipients: list[str], html: str) -> None:
    """Écrit le contenu d'un email dans un fichier local (fallback dev)."""
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
    except Exception:
        logger.error("Impossible d'écrire l'email dans le fichier", exc_info=True)


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
    except (JWTError, ValueError, KeyError):
        return None


async def send_verification_email(email: str, name: str, user_id: str) -> None:
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

    try:
        await fm.send_message(message)
        logger.info(f"Verification email sent to {email}")
    except Exception:
        logger.error(f"Failed to send verification email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_prescription_email(
    patient_email: str,
    patient_name: str | None,
    prescriber_name: str,
    prescriber_profession: str | None,
    prescriber_organization: str | None,
    link: str,
    product_names: list[str],
    message: str | None,
    expires_at: str,
) -> None:
    template = jinja_env.get_template("prescription.html")
    html = template.render(
        patient_name=patient_name or "Cher patient",
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

    try:
        await fm.send_message(message_schema)
        logger.info(f"Prescription email sent to {patient_email}")
    except Exception:
        logger.error(f"Failed to send prescription email to {patient_email}", exc_info=True)
        _write_email_to_file(message_schema.subject, [patient_email], html)


async def send_prescription_viewed_email(
    prescriber_email: str,
    prescriber_name: str,
    patient_name: str | None,
    prescription_link: str,
) -> None:
    template = jinja_env.get_template("prescription_viewed.html")
    html = template.render(
        prescriber_name=prescriber_name,
        patient_name=patient_name or "Votre patient",
        prescription_link=prescription_link,
    )
    message = MessageSchema(
        subject="Votre prescription a été consultée - MentalTech Discover",
        recipients=[prescriber_email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Prescription viewed email sent to {prescriber_email}")
    except Exception:
        logger.error(f"Failed to send prescription viewed email to {prescriber_email}", exc_info=True)
        _write_email_to_file(message.subject, [prescriber_email], html)


async def send_prescriber_approved_email(email: str, name: str, dashboard_url: str) -> None:
    template = jinja_env.get_template("prescriber_approved.html")
    html = template.render(name=name, dashboard_url=dashboard_url)
    message = MessageSchema(
        subject="Votre compte prescripteur est validé - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Prescriber approved email sent to {email}")
    except Exception:
        logger.error(f"Failed to send prescriber approved email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_submission_confirmation_email(email: str, name: str, confirm_token: str) -> None:
    confirm_url = f"{settings.FRONTEND_URL}/confirmer-soumission?token={confirm_token}"
    template = jinja_env.get_template("submission_confirmation.html")
    html = template.render(name=name, confirm_url=confirm_url)
    message = MessageSchema(
        subject="Confirmez votre demande de référencement - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Submission confirmation email sent to {email}")
    except Exception:
        logger.error(f"Failed to send submission confirmation email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_submission_received_admin_email(
    admin_email: str,
    contact_name: str,
    contact_email: str,
    product_name: str | None,
    collectif_requested: bool,
    collectif_ca_range: str | None,
) -> None:
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
    try:
        await fm.send_message(message)
        logger.info(f"Admin submission notification sent to {admin_email}")
    except Exception:
        logger.error(f"Failed to send admin submission notification", exc_info=True)
        _write_email_to_file(message.subject, [admin_email], html)


async def send_submission_approved_email(email: str, name: str, product_name: str | None) -> None:
    catalog_url = f"{settings.FRONTEND_URL}/catalogue"
    template = jinja_env.get_template("submission_approved.html")
    html = template.render(name=name, product_name=product_name, catalog_url=catalog_url)
    message = MessageSchema(
        subject="Votre solution a été acceptée ! - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Submission approved email sent to {email}")
    except Exception:
        logger.error(f"Failed to send submission approved email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_submission_rejected_email(email: str, name: str, product_name: str | None, admin_notes: str | None) -> None:
    template = jinja_env.get_template("submission_rejected.html")
    html = template.render(name=name, product_name=product_name, admin_notes=admin_notes)
    message = MessageSchema(
        subject="Réponse à votre demande de référencement - MentalTech Discover",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Submission rejected email sent to {email}")
    except Exception:
        logger.error(f"Failed to send submission rejected email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_collectif_invite_email(email: str, name: str, helloasso_url: str) -> None:
    template = jinja_env.get_template("collectif_invite.html")
    html = template.render(name=name, helloasso_url=helloasso_url)
    message = MessageSchema(
        subject="Bienvenue dans le Collectif MentalTech !",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Collectif invite email sent to {email}")
    except Exception:
        logger.error(f"Failed to send collectif invite email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_collectif_refused_email(email: str, name: str, admin_notes: str | None) -> None:
    template = jinja_env.get_template("collectif_refused.html")
    html = template.render(name=name, admin_notes=admin_notes)
    message = MessageSchema(
        subject="Réponse à votre candidature au Collectif MentalTech",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Collectif refused email sent to {email}")
    except Exception:
        logger.error(f"Failed to send collectif refused email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_health_pro_confirmation_email(email: str, name: str, confirm_token: str) -> None:
    confirm_url = f"{settings.FRONTEND_URL}/confirmer-candidature?token={confirm_token}"
    template = jinja_env.get_template("health_pro_confirmation.html")
    html = template.render(name=name, confirm_url=confirm_url)
    message = MessageSchema(
        subject="Confirmez votre candidature au Collectif MentalTech",
        recipients=[email],
        body=html,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
        logger.info(f"Health pro confirmation email sent to {email}")
    except Exception:
        logger.error(f"Failed to send health pro confirmation email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)


async def send_health_pro_admin_notification(
    admin_email: str,
    name: str,
    email: str,
    profession: str,
    rpps_adeli: str | None = None,
    organization: str | None = None,
    motivation: str | None = None,
) -> None:
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
    try:
        await fm.send_message(message)
        logger.info(f"Health pro admin notification sent to {admin_email}")
    except Exception:
        logger.error(f"Failed to send health pro admin notification", exc_info=True)
        _write_email_to_file(message.subject, [admin_email], html)


async def send_reset_password_email(email: str, name: str, user_id: str) -> None:
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

    try:
        await fm.send_message(message)
        logger.info(f"Password reset email sent to {email}")
    except Exception:
        logger.error(f"Failed to send password reset email to {email}", exc_info=True)
        _write_email_to_file(message.subject, [email], html)
