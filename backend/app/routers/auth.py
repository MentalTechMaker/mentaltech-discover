from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Cookie,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..config import settings
from ..schemas.user import (
    UserRegister,
    PrescriberRegister,
    UserLogin,
    UserResponse,
    ChangePassword,
    ForgotPassword,
    ResetPassword,
)
from ..schemas.auth import TokenResponse, TokenRefresh
from ..services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    validate_password_strength,
    DUMMY_HASH,
)
from ..services.email import (
    send_verification_email,
    send_reset_password_email,
    decode_email_token,
)
from ..dependencies import get_current_user
from ..rate_limit import limiter

router = APIRouter(prefix="/api/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_COOKIE_MAX_AGE = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60


def _set_auth_response(
    access_token: str, refresh_token: str, status_code: int = 200
) -> JSONResponse:
    response = JSONResponse(
        content={
            "access_token": access_token,
            "refresh_token": "",
            "token_type": "bearer",
        },
        status_code=status_code,
    )
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=REFRESH_COOKIE_MAX_AGE,
        httponly=True,
        secure=not settings.FRONTEND_URL.startswith("http://localhost"),
        samesite="lax",
        path="/api/auth",
    )
    return response


@router.post(
    "/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED
)
@limiter.limit("5/minute")
async def register(
    request: Request,
    data: UserRegister,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    password_error = validate_password_strength(data.password)
    if password_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_error,
        )

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte avec cet email existe déjà",
        )

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte avec cet email existe déjà",
        )

    background_tasks.add_task(
        send_verification_email, user.email, user.name, str(user.id)
    )

    return _set_auth_response(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        status_code=201,
    )


@router.post(
    "/register-prescriber",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
async def register_prescriber(
    request: Request,
    data: PrescriberRegister,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    password_error = validate_password_strength(data.password)
    if password_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_error,
        )

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte avec cet email existe déjà",
        )

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
        role="prescriber",
        profession=data.profession,
        organization=data.organization,
        rpps_adeli=data.rpps_adeli,
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte avec cet email existe déjà",
        )

    background_tasks.add_task(
        send_verification_email, user.email, user.name, str(user.id)
    )

    return _set_auth_response(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
        status_code=201,
    )


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    password_hash = user.password_hash if user else DUMMY_HASH
    valid = verify_password(data.password, password_hash)
    if not user or not valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    return _set_auth_response(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.post("/refresh")
@limiter.limit("30/minute")
def refresh(
    request: Request,
    data: TokenRefresh | None = None,
    refresh_token_cookie: str | None = Cookie(default=None, alias=REFRESH_COOKIE_NAME),
    db: Session = Depends(get_db),
):
    # Accept refresh token from cookie (preferred) or body (backward compat)
    token = refresh_token_cookie
    if not token and data and data.refresh_token:
        token = data.refresh_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token manquant",
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expiré",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé",
        )

    return _set_auth_response(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        email_verified=user.email_verified,
        profession=user.profession,
        organization=user.organization,
        rpps_adeli=user.rpps_adeli,
        is_verified_prescriber=user.is_verified_prescriber,
        company_name=user.company_name,
        siret=user.siret,
        company_website=user.company_website,
        is_verified_publisher=user.is_verified_publisher,
    )


@router.put("/change-password")
@limiter.limit("5/minute")
def change_password(
    request: Request,
    data: ChangePassword,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe actuel incorrect",
        )

    password_error = validate_password_strength(data.new_password)
    if password_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_error,
        )

    user.password_hash = hash_password(data.new_password)
    user.password_changed_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Mot de passe modifié avec succès"}


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(
    request: Request,
    data: ForgotPassword,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email).first()

    # Always return success to prevent email enumeration
    if user:
        background_tasks.add_task(
            send_reset_password_email, user.email, user.name, str(user.id)
        )

    return {
        "message": "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé"
    }


@router.post("/reset-password")
@limiter.limit("5/minute")
def reset_password(
    request: Request, data: ResetPassword, db: Session = Depends(get_db)
):
    token_data = decode_email_token(data.token, "reset_password", return_full=True)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lien de réinitialisation invalide ou expiré",
        )

    user_id = token_data.get("sub")
    token_issued_at = token_data.get("iat")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur non trouvé",
        )

    # Invalidate token if password was changed after token was issued
    if user.password_changed_at and token_issued_at:
        issued_dt = datetime.fromtimestamp(token_issued_at, tz=timezone.utc)
        if issued_dt < user.password_changed_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce lien de réinitialisation a déjà été utilisé",
            )

    password_error = validate_password_strength(data.new_password)
    if password_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=password_error,
        )

    user.password_hash = hash_password(data.new_password)
    user.password_changed_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Mot de passe réinitialisé avec succès"}


@router.get("/verify-email")
@limiter.limit("10/minute")
def verify_email(request: Request, token: str, db: Session = Depends(get_db)):
    user_id = decode_email_token(token, "verify_email")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lien de vérification invalide ou expiré",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utilisateur non trouvé",
        )

    user.email_verified = True
    db.commit()

    return {"message": "Email vérifié avec succès"}


@router.post("/resend-verification")
@limiter.limit("2/minute")
async def resend_verification(
    request: Request,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user),
):
    if user.email_verified:
        return {"message": "Email déjà vérifié"}

    background_tasks.add_task(
        send_verification_email, user.email, user.name, str(user.id)
    )

    return {"message": "Email de vérification renvoyé"}
