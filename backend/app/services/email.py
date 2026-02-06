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
    verify_url = f"{settings.FRONTEND_URL}/#verify-email?token={token}"

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


async def send_reset_password_email(email: str, name: str, user_id: str) -> None:
    token = create_email_token(user_id, "reset_password", expire_hours=1)
    reset_url = f"{settings.FRONTEND_URL}/#reset-password?token={token}"

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
