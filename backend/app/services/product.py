from sqlalchemy.orm import Session

from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, PricingSchema, ScoringSchema

ALLOWED_FIELDS = {
    "name", "type", "tagline", "description", "url", "logo",
    "tags", "audience", "problems_solved", "preference_match",
    "for_company", "is_mentaltech_member",
    "pricing_model", "pricing_amount", "pricing_details",
    "last_updated",
    "score_security", "score_efficacy", "score_accessibility",
    "score_ux", "score_support",
    "justification_security", "justification_efficacy", "justification_accessibility",
    "justification_ux", "justification_support",
}


def compute_label(
    security: int | None,
    efficacy: int | None,
    accessibility: int | None,
    ux: int | None,
    support: int | None,
) -> tuple[int | None, str | None]:
    """Compute total score (0-100) and grade (A-E) from 5 sub-scores (0-20 each).
    Returns (None, None) if no score has been set."""
    scores = [security, efficacy, accessibility, ux, support]
    if all(s is None for s in scores):
        return None, None
    total = sum(s or 0 for s in scores)
    if total >= 80:
        return total, "A"
    if total >= 60:
        return total, "B"
    if total >= 40:
        return total, "C"
    if total >= 20:
        return total, "D"
    return total, "E"


def _to_response(product: Product) -> ProductResponse:
    """Map a SQLAlchemy Product (snake_case) to a ProductResponse (camelCase)."""
    pricing = None
    if product.pricing_model or product.pricing_amount or product.pricing_details:
        pricing = PricingSchema(
            model=product.pricing_model,
            amount=product.pricing_amount,
            details=product.pricing_details,
        )

    scoring = None
    score_total = None
    score_label = None
    score_fields = ("score_security", "score_efficacy", "score_accessibility", "score_ux", "score_support")
    justification_fields = ("justification_security", "justification_efficacy", "justification_accessibility", "justification_ux", "justification_support")
    has_scores = any(getattr(product, f) is not None for f in score_fields)
    has_justifications = any(getattr(product, f) is not None for f in justification_fields)
    if has_scores or has_justifications:
        scoring = ScoringSchema(
            security=product.score_security,
            efficacy=product.score_efficacy,
            accessibility=product.score_accessibility,
            ux=product.score_ux,
            support=product.score_support,
            justificationSecurity=product.justification_security,
            justificationEfficacy=product.justification_efficacy,
            justificationAccessibility=product.justification_accessibility,
            justificationUx=product.justification_ux,
            justificationSupport=product.justification_support,
        )
        score_total, score_label = compute_label(
            product.score_security,
            product.score_efficacy,
            product.score_accessibility,
            product.score_ux,
            product.score_support,
        )

    return ProductResponse(
        id=product.id,
        name=product.name,
        type=product.type,
        tagline=product.tagline,
        description=product.description,
        url=product.url,
        logo=product.logo,
        tags=product.tags or [],
        audience=product.audience or [],
        problemsSolved=product.problems_solved or [],
        preferenceMatch=product.preference_match or [],
        forCompany=product.for_company or False,
        isMentaltechMember=product.is_mentaltech_member or False,
        pricing=pricing,
        lastUpdated=product.last_updated.isoformat() if product.last_updated else None,
        scoring=scoring,
        scoreTotal=score_total,
        scoreLabel=score_label,
    )


def get_all_products(
    db: Session, limit: int | None = None, offset: int = 0
) -> list[ProductResponse]:
    query = db.query(Product).order_by(Product.name).offset(offset)
    if limit is not None:
        query = query.limit(limit)
    products = query.all()
    return [_to_response(p) for p in products]


def count_products(db: Session) -> int:
    return db.query(Product).count()


def get_product_by_id(db: Session, product_id: str) -> ProductResponse | None:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    return _to_response(product)


def create_product(db: Session, data: ProductCreate) -> ProductResponse:
    from datetime import date as date_type

    product = Product(
        id=data.id,
        name=data.name,
        type=data.type,
        tagline=data.tagline,
        description=data.description,
        url=data.url,
        logo=data.logo,
        tags=data.tags,
        audience=data.audience,
        problems_solved=data.problemsSolved,
        preference_match=data.preferenceMatch,
        for_company=data.forCompany,
        is_mentaltech_member=data.isMentaltechMember,
        pricing_model=data.pricing.model if data.pricing else None,
        pricing_amount=data.pricing.amount if data.pricing else None,
        pricing_details=data.pricing.details if data.pricing else None,
        last_updated=date_type.fromisoformat(data.lastUpdated) if data.lastUpdated else None,
        score_security=data.scoreSecurity,
        score_efficacy=data.scoreEfficacy,
        score_accessibility=data.scoreAccessibility,
        score_ux=data.scoreUx,
        score_support=data.scoreSupport,
        justification_security=data.justificationSecurity,
        justification_efficacy=data.justificationEfficacy,
        justification_accessibility=data.justificationAccessibility,
        justification_ux=data.justificationUx,
        justification_support=data.justificationSupport,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_response(product)


def update_product(db: Session, product_id: str, data: ProductUpdate) -> ProductResponse | None:
    from datetime import date as date_type

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    update_data = data.model_dump(exclude_unset=True)

    field_mapping = {
        "problemsSolved": "problems_solved",
        "preferenceMatch": "preference_match",
        "forCompany": "for_company",
        "isMentaltechMember": "is_mentaltech_member",
        "lastUpdated": "last_updated",
        "scoreSecurity": "score_security",
        "scoreEfficacy": "score_efficacy",
        "scoreAccessibility": "score_accessibility",
        "scoreUx": "score_ux",
        "scoreSupport": "score_support",
        "justificationSecurity": "justification_security",
        "justificationEfficacy": "justification_efficacy",
        "justificationAccessibility": "justification_accessibility",
        "justificationUx": "justification_ux",
        "justificationSupport": "justification_support",
    }

    for camel_key, snake_key in field_mapping.items():
        if camel_key in update_data:
            value = update_data.pop(camel_key)
            if camel_key == "lastUpdated" and value:
                value = date_type.fromisoformat(value)
            update_data[snake_key] = value

    if "pricing" in update_data:
        pricing = update_data.pop("pricing")
        if pricing:
            update_data["pricing_model"] = pricing.get("model")
            update_data["pricing_amount"] = pricing.get("amount")
            update_data["pricing_details"] = pricing.get("details")

    for key, value in update_data.items():
        if key in ALLOWED_FIELDS:
            setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return _to_response(product)


def delete_product(db: Session, product_id: str) -> bool:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True
