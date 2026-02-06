from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, PaginatedProducts
from ..services.product import (
    get_all_products,
    get_product_by_id,
    create_product,
    update_product,
    delete_product,
    count_products,
)

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=PaginatedProducts)
def list_products(
    limit: int | None = Query(default=None, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    items = get_all_products(db, limit=limit, offset=offset)
    total = count_products(db)
    return PaginatedProducts(items=items, total=total, limit=limit, offset=offset)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé",
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def add_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    existing = get_product_by_id(db, data.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un produit avec cet identifiant existe déjà",
        )
    return create_product(db, data)


@router.put("/{product_id}", response_model=ProductResponse)
def edit_product(
    product_id: str,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    product = update_product(db, product_id, data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé",
        )
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_product(
    product_id: str,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    if not delete_product(db, product_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produit non trouvé",
        )
