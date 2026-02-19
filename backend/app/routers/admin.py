import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from ..models.user import User
from ..models.product_update import ProductUpdate
from ..schemas.prescriber import PrescriberListItem, ProductUpdateCreate, ProductUpdateResponse

LOGO_UPLOAD_DIR = Path("/tmp/uploads/logos")
LOGO_ALLOWED_TYPES = {"image/png", "image/jpeg", "image/svg+xml", "image/webp"}
LOGO_MAX_SIZE = 2 * 1024 * 1024  # 2 MB

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ─── LOGO UPLOAD ────────────────────────────────────────────

@router.post("/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    _admin: User = Depends(require_admin),
):
    if file.content_type not in LOGO_ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type de fichier non supporté. Types acceptés : PNG, JPEG, SVG, WebP",
        )

    content = await file.read()
    if len(content) > LOGO_MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier trop volumineux (max 2 Mo)",
        )

    ext = Path(file.filename or "logo").suffix or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"

    LOGO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = LOGO_UPLOAD_DIR / filename
    dest.write_bytes(content)

    return JSONResponse({"path": f"/uploads/logos/{filename}"})


# ─── PRESCRIBER VALIDATION ───────────────────────────────────

@router.get("/prescribers", response_model=list[PrescriberListItem])
def list_prescribers(
    pending_only: bool = Query(default=False),
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role == "prescriber")
    if pending_only:
        query = query.filter(User.is_verified_prescriber == False)
    prescribers = query.order_by(User.created_at.desc()).all()

    return [
        PrescriberListItem(
            id=str(p.id),
            email=p.email,
            name=p.name,
            profession=p.profession,
            organization=p.organization,
            rpps_adeli=p.rpps_adeli,
            is_verified_prescriber=p.is_verified_prescriber,
            created_at=p.created_at.isoformat(),
        )
        for p in prescribers
    ]


@router.post("/prescribers/{prescriber_id}/verify")
def verify_prescriber(
    prescriber_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == prescriber_id, User.role == "prescriber").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable")

    user.is_verified_prescriber = True
    db.commit()

    return {"message": f"Prescripteur {user.name} validé avec succès"}


@router.post("/prescribers/{prescriber_id}/reject")
def reject_prescriber(
    prescriber_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == prescriber_id, User.role == "prescriber").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescripteur introuvable")

    user.is_verified_prescriber = False
    db.commit()

    return {"message": f"Prescripteur {user.name} refusé"}


# ─── PRODUCT UPDATES (VEILLE) ────────────────────────────────

@router.post("/product-updates", response_model=ProductUpdateResponse, status_code=status.HTTP_201_CREATED)
def create_product_update(
    data: ProductUpdateCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    from ..models.product import Product

    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable")

    valid_types = ("price_change", "score_change", "new_feature", "study", "general")
    if data.update_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type invalide. Types valides : {', '.join(valid_types)}",
        )

    update = ProductUpdate(
        product_id=data.product_id,
        update_type=data.update_type,
        title=data.title,
        description=data.description,
    )
    db.add(update)
    db.commit()
    db.refresh(update)

    return ProductUpdateResponse(
        id=str(update.id),
        productId=update.product_id,
        productName=product.name,
        updateType=update.update_type,
        title=update.title,
        description=update.description,
        createdAt=update.created_at.isoformat(),
    )
