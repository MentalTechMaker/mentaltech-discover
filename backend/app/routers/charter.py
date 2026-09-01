import time
from datetime import datetime, timezone
from html import escape

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.charter_signatory import CharterSignatory
from ..schemas.charter import CharterSignatoryCreate, CharterSignatoryPublic
from ..services.email import (
    create_email_token,
    decode_email_token,
    send_charter_confirmation_email,
    send_charter_admin_notification,
)
from ..config import settings
from ..rate_limit import limiter

router = APIRouter(prefix="/api/charter", tags=["charter"])

# Meme garde-fou anti-bot que /api/public (honeypot + delai minimum de remplissage).
BOT_MIN_SECONDS = 3.0


def _check_bot(honeypot: str, submitted_at_ts: float) -> None:
    if honeypot:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bot détecté")
    if submitted_at_ts > 0 and (time.time() - submitted_at_ts) < BOT_MIN_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Soumission trop rapide"
        )


@router.post("/sign", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/hour")
async def sign_charter(
    data: CharterSignatoryCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    _check_bot(data.honeypot, data.submitted_at_ts)

    email_lower = str(data.email).lower().strip()

    existing = (
        db.query(CharterSignatory)
        .filter(func.lower(func.trim(CharterSignatory.email)) == email_lower)
        .first()
    )

    if existing and existing.email_confirmed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette adresse email a déjà signé la charte.",
        )

    if existing:
        signatory = existing
    else:
        signatory = CharterSignatory(
            status="pending_email", email_confirmed=False, source="form"
        )
        db.add(signatory)

    signatory.name = data.name
    signatory.organization = data.organization
    signatory.email = str(data.email)
    signatory.kind = data.kind
    signatory.consent = data.consent
    signatory.charter_version = "2026"

    try:
        db.commit()
    except IntegrityError:
        # Deux POST concurrents sur le meme email : le check applicatif ci-dessus
        # a pu laisser passer les deux avant que l'un ne commite. L'index unique
        # sur email tranche,on renvoie la meme 409 que le cas non concurrent.
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cette adresse email a déjà signé la charte.",
        )
    db.refresh(signatory)

    token = create_email_token(str(signatory.id), "confirm_charter", expire_hours=48)
    signatory.confirm_token = token
    db.commit()

    email_sent = await send_charter_confirmation_email(
        email=str(data.email), name=data.name, confirm_token=token
    )

    return {
        "message": f"Email de confirmation {'renvoyé' if existing else 'envoyé'}. Vérifiez votre boîte mail.",
        "id": str(signatory.id),
        "email_sent": email_sent,
    }


def _charter_page(title: str, message: str, status_code: int = 200) -> HTMLResponse:
    # Page HTML directe : mentaltech.fr est un site statique, sans route de
    # confirmation dediee (contrairement au frontend React de Discover).
    # Referrer-Policy: no-referrer,l'URL porte le token dans sa query string ;
    # le lien "Retour a la charte" ne doit jamais le faire fuiter en Referer.
    html = f"""<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>{escape(title)}</title>
<style>body{{font-family:Arial,sans-serif;background:#f8f9fa;margin:0;padding:40px 20px;}}
.box{{max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;
box-shadow:0 2px 8px rgba(0,0,0,.1);text-align:center;}}
a{{display:inline-block;margin-top:20px;color:#e2574a;font-weight:600;text-decoration:none;}}</style>
</head><body><div class="box"><h1>{escape(title)}</h1><p>{escape(message)}</p>
<a href="{settings.COLLECTIF_WEBSITE_URL}/charte">Retour à la charte</a></div></body></html>"""
    return HTMLResponse(
        html, status_code=status_code, headers={"Referrer-Policy": "no-referrer"}
    )


@router.get("/confirm", response_class=HTMLResponse)
async def confirm_charter(
    token: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    signatory_id = decode_email_token(token, "confirm_charter")
    if not signatory_id:
        return _charter_page(
            "Lien invalide ou expiré",
            "Ce lien de confirmation n'est plus valide. Signez à nouveau la charte pour recevoir un nouveau lien.",
            status_code=400,
        )

    signatory = (
        db.query(CharterSignatory)
        .filter(
            CharterSignatory.id == signatory_id,
            CharterSignatory.confirm_token == token,
        )
        .first()
    )

    if not signatory:
        return _charter_page(
            "Signature introuvable", "Nous ne retrouvons pas cette signature.", status_code=404
        )

    if signatory.email_confirmed:
        return _charter_page("Déjà confirmée", "Cette signature est déjà confirmée. Merci !")

    signatory.email_confirmed = True
    signatory.status = "confirmed"
    signatory.confirm_token = None
    signatory.signed_at = datetime.now(timezone.utc)
    signatory.updated_at = datetime.now(timezone.utc)
    db.commit()

    background_tasks.add_task(
        send_charter_admin_notification,
        admin_email=settings.ADMIN_EMAIL,
        name=signatory.name,
        organization=signatory.organization,
        email=signatory.email,
        kind=signatory.kind,
    )

    return _charter_page(
        "Signature confirmée",
        f"Merci {signatory.name}, la signature de {signatory.organization} est enregistrée.",
    )


@router.get("/signatories", response_model=list[CharterSignatoryPublic])
async def list_signatories(db: Session = Depends(get_db)):
    """Liste publique, signataires confirmes uniquement. Consomme au build par
    mentaltech.fr (pattern scripts/fetch-products.mjs), jamais au runtime."""
    signatories = (
        db.query(CharterSignatory)
        .filter(CharterSignatory.email_confirmed.is_(True))
        .order_by(CharterSignatory.signed_at.asc())
        .limit(2000)
        .all()
    )
    return [
        CharterSignatoryPublic(
            name=s.name,
            organization=s.organization,
            kind=s.kind,
            signedAt=s.signed_at.isoformat() if s.signed_at else s.created_at.isoformat(),
        )
        for s in signatories
    ]
