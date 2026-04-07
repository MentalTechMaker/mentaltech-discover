from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, text

from ..database import get_db
from ..dependencies import require_prescriber_or_admin
from ..models.user import User
from ..models.product import Product
from ..models.favorite import PrescriberFavorite
from ..models.note import PrescriberNote
from ..models.product_update import ProductUpdate
from ..models.prescription import Prescription
from ..schemas.prescriber import (
    FavoriteToggle,
    FavoriteResponse,
    NoteUpsert,
    NoteResponse,
    ProductUpdateResponse,
    CommunityStats,
)
from ..services.product import _to_response

router = APIRouter(prefix="/api/prescriber", tags=["prescriber"])


# ─── FAVORITES ───────────────────────────────────────────────


@router.get("/favorites", response_model=list[FavoriteResponse])
def list_favorites(
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    favorites = (
        db.query(PrescriberFavorite)
        .filter(PrescriberFavorite.prescriber_id == user.id)
        .order_by(PrescriberFavorite.created_at.desc())
        .all()
    )
    return [
        FavoriteResponse(
            id=str(f.id),
            productId=f.product_id,
            createdAt=f.created_at.isoformat(),
        )
        for f in favorites
    ]


@router.post(
    "/favorites", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED
)
def add_favorite(
    data: FavoriteToggle,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )

    favorite = PrescriberFavorite(prescriber_id=user.id, product_id=data.product_id)
    try:
        db.add(favorite)
        db.commit()
        db.refresh(favorite)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Déjà en favoris"
        )

    return FavoriteResponse(
        id=str(favorite.id),
        productId=favorite.product_id,
        createdAt=favorite.created_at.isoformat(),
    )


@router.delete("/favorites/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    product_id: str,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    favorite = (
        db.query(PrescriberFavorite)
        .filter(
            PrescriberFavorite.prescriber_id == user.id,
            PrescriberFavorite.product_id == product_id,
        )
        .first()
    )
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Favori introuvable"
        )
    db.delete(favorite)
    db.commit()


# ─── NOTES ────────────────────────────────────────────────────


@router.get("/notes", response_model=list[NoteResponse])
def list_notes(
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    notes = (
        db.query(PrescriberNote)
        .filter(PrescriberNote.prescriber_id == user.id)
        .order_by(PrescriberNote.updated_at.desc())
        .all()
    )
    return [
        NoteResponse(
            id=str(n.id),
            productId=n.product_id,
            content=n.content,
            createdAt=n.created_at.isoformat(),
            updatedAt=n.updated_at.isoformat(),
        )
        for n in notes
    ]


@router.put("/notes", response_model=NoteResponse)
def upsert_note(
    data: NoteUpsert,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable"
        )

    note = (
        db.query(PrescriberNote)
        .filter(
            PrescriberNote.prescriber_id == user.id,
            PrescriberNote.product_id == data.product_id,
        )
        .first()
    )

    if note:
        note.content = data.content
        note.updated_at = datetime.now(timezone.utc)
    else:
        note = PrescriberNote(
            prescriber_id=user.id,
            product_id=data.product_id,
            content=data.content,
        )
        db.add(note)

    db.commit()
    db.refresh(note)

    return NoteResponse(
        id=str(note.id),
        productId=note.product_id,
        content=note.content,
        createdAt=note.created_at.isoformat(),
        updatedAt=note.updated_at.isoformat(),
    )


@router.delete("/notes/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    product_id: str,
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    note = (
        db.query(PrescriberNote)
        .filter(
            PrescriberNote.prescriber_id == user.id,
            PrescriberNote.product_id == product_id,
        )
        .first()
    )
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note introuvable"
        )
    db.delete(note)
    db.commit()


# ─── VEILLE / PRODUCT UPDATES ────────────────────────────────


@router.get("/updates", response_model=list[ProductUpdateResponse])
def list_updates(
    favorites_only: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    query = db.query(ProductUpdate, Product.name).join(
        Product, ProductUpdate.product_id == Product.id
    )

    if favorites_only:
        fav_ids = (
            db.query(PrescriberFavorite.product_id)
            .filter(PrescriberFavorite.prescriber_id == user.id)
            .subquery()
        )
        query = query.filter(ProductUpdate.product_id.in_(fav_ids))

    results = (
        query.order_by(ProductUpdate.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return [
        ProductUpdateResponse(
            id=str(update.id),
            productId=update.product_id,
            productName=product_name,
            updateType=update.update_type,
            title=update.title,
            description=update.description,
            createdAt=update.created_at.isoformat(),
        )
        for update, product_name in results
    ]


# ─── COMPARATOR ───────────────────────────────────────────────


@router.get("/compare")
def compare_products(
    ids: str = Query(..., description="Comma-separated product IDs (2-4)"),
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    product_ids = [pid.strip() for pid in ids.split(",") if pid.strip()]
    if len(product_ids) < 2 or len(product_ids) > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sélectionnez entre 2 et 4 solutions à comparer",
        )

    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    if len(products) != len(product_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Un ou plusieurs produits introuvables",
        )

    return [_to_response(p).model_dump() for p in products]


# ─── COMMUNITY STATS ─────────────────────────────────────────


@router.get("/community-stats", response_model=list[CommunityStats])
def community_stats(
    user: User = Depends(require_prescriber_or_admin),
    db: Session = Depends(get_db),
):
    # SQL aggregation via unnest - O(1) memory, O(N) DB
    rows = db.execute(text("""
        SELECT
            pid,
            COUNT(*)                    AS prescription_count,
            COUNT(DISTINCT prescriber_id) AS prescriber_count,
            p.name                       AS product_name
        FROM prescriptions,
             unnest(product_ids) AS pid
        JOIN products p ON p.id = pid
        GROUP BY pid, p.name
        ORDER BY prescription_count DESC
        LIMIT 20
    """)).fetchall()

    return [
        CommunityStats(
            productId=row.pid,
            productName=row.product_name,
            prescriberCount=row.prescriber_count,
            prescriptionCount=row.prescription_count,
        )
        for row in rows
    ]
