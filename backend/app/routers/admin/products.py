import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ...utils import validate_magic_bytes
from ...database import get_db
from ...dependencies import require_admin
from ...models.user import User
from ...models.product import Product
from ...models.product_update import ProductUpdate
from ...schemas.prescriber import ProductUpdateCreate, ProductUpdateResponse
from ...schemas.product import ProductResponse
from ...services.product import (
    _to_response as product_to_response,
    get_all_products as svc_get_all_products,
)

_validate_magic_bytes = validate_magic_bytes

LOGO_UPLOAD_DIR = Path("/tmp/uploads/logos")
LOGO_ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp"}
LOGO_MAX_SIZE = 2 * 1024 * 1024  # 2 MB

router = APIRouter(tags=["admin"])


# ---- ADMIN PRODUCTS (includes hidden/defunct) ----


@router.get("/products", response_model=list[ProductResponse])
def list_all_products(
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Return ALL products including hidden/defunct ones (admin only)."""
    return svc_get_all_products(db, include_all=True, include_scoring=True)


@router.patch("/products/{product_id}/visibility", response_model=ProductResponse)
def toggle_product_visibility(
    product_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Toggle is_visible for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )
    product.is_visible = not product.is_visible
    db.commit()
    db.refresh(product)
    return product_to_response(product, include_scoring=True)


@router.patch("/products/{product_id}/defunct", response_model=ProductResponse)
def toggle_product_defunct(
    product_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Toggle company_defunct for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )
    product.company_defunct = not product.company_defunct
    db.commit()
    db.refresh(product)
    return product_to_response(product, include_scoring=True)


@router.patch("/products/{product_id}/demo", response_model=ProductResponse)
def toggle_product_demo(
    product_id: str,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Toggle is_demo for a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )
    product.is_demo = not product.is_demo
    db.commit()
    db.refresh(product)
    return product_to_response(product, include_scoring=True)


# ---- LOGO UPLOAD ----


@router.post("/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    _admin: User = Depends(require_admin),
):
    if file.content_type not in LOGO_ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Type de fichier non supporté. Types acceptés : PNG, JPEG, WebP",
        )

    content = await file.read()
    if len(content) > LOGO_MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fichier trop volumineux (max 2 Mo)",
        )

    if not _validate_magic_bytes(content, file.content_type):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contenu du fichier invalide",
        )

    mime_to_ext = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}
    ext = mime_to_ext.get(file.content_type, ".png")
    filename = f"{uuid.uuid4().hex}{ext}"

    LOGO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = LOGO_UPLOAD_DIR / filename
    dest.write_bytes(content)

    return JSONResponse({"path": f"/uploads/logos/{filename}"})


# ---- PRODUCT UPDATES (VEILLE) ----


@router.post(
    "/product-updates",
    response_model=ProductUpdateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product_update(
    data: ProductUpdateCreate,
    _admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    from ...models.product import Product

    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )

    valid_types = ("price_change", "new_feature", "study", "general")
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
