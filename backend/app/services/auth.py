import re
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from jwt.exceptions import PyJWTError

from ..config import settings

ALGORITHM = "HS256"
DUMMY_HASH = bcrypt.hashpw(
    b"dummy-password-for-timing-protection", bcrypt.gensalt()
).decode()
MIN_PASSWORD_LENGTH = 8


def validate_password_strength(password: str) -> str | None:
    """Return an error message if the password is too weak, or None if valid."""
    if len(password) < MIN_PASSWORD_LENGTH:
        return (
            f"Le mot de passe doit contenir au moins {MIN_PASSWORD_LENGTH} caractères"
        )
    if not re.search(r"[A-Z]", password):
        return "Le mot de passe doit contenir au moins une majuscule"
    if not re.search(r"[a-z]", password):
        return "Le mot de passe doit contenir au moins une minuscule"
    if not re.search(r"\d", password):
        return "Le mot de passe doit contenir au moins un chiffre"
    return None


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": subject, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {"sub": subject, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWTError:
        return None
