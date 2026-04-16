from sqlalchemy.orm import Session

from ..utils import to_dict
from ..models.product import Product
from ..schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    PricingSchema,
    ScoringSchema,
)

ALLOWED_FIELDS = {
    "name",
    "tagline",
    "description",
    "url",
    "logo",
    "tags",
    "audience",
    "problems_solved",
    "preference_match",
    "is_mentaltech_member",
    "is_visible",
    "company_defunct",
    "is_demo",
    "pricing_model",
    "pricing_amount",
    "pricing_details",
    "last_updated",
    "score_security",
    "score_efficacy",
    "score_accessibility",
    "score_ux",
    "score_support",
    "justification_security",
    "justification_efficacy",
    "justification_accessibility",
    "justification_ux",
    "justification_support",
    "scoring_criteria",
    "audience_priorities",
    "problems_priorities",
}


def compute_label(
    security: int | None,
    efficacy: int | None,
    accessibility: int | None,
    ux: int | None,
    support: int | None,
) -> tuple[int | None, str | None]:
    """Compute total score (0-100) and grade (A-E) from filled sub-scores (0-5 each).
    Returns (None, None) if no score has been set."""
    scores = [security, efficacy, accessibility, ux, support]
    filled = [s for s in scores if s is not None]
    if not filled:
        return None, None
    # Always divide by 5: missing pillars count as 0, not as absent
    avg = sum(s if s is not None else 0 for s in scores) / len(scores)
    total = round(avg / 5 * 100)  # scale to 0-100
    if total >= 80:
        return total, "A"
    if total >= 60:
        return total, "B"
    if total >= 40:
        return total, "C"
    if total >= 20:
        return total, "D"
    return total, "E"


def _to_response(product: Product, include_scoring: bool = False) -> ProductResponse:
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
    if include_scoring:
        score_fields = (
            "score_security",
            "score_efficacy",
            "score_accessibility",
            "score_ux",
            "score_support",
        )
        justification_fields = (
            "justification_security",
            "justification_efficacy",
            "justification_accessibility",
            "justification_ux",
            "justification_support",
        )
        has_scores = any(getattr(product, f) is not None for f in score_fields)
        has_justifications = any(
            getattr(product, f) is not None for f in justification_fields
        )
    else:
        has_scores = False
        has_justifications = False
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
        tagline=product.tagline,
        description=product.description,
        url=product.url,
        logo=product.logo,
        tags=product.tags or [],
        audience=product.audience or [],
        problemsSolved=product.problems_solved or [],
        preferenceMatch=product.preference_match or [],
        isMentaltechMember=product.is_mentaltech_member or False,
        isVisible=product.is_visible if product.is_visible is not None else True,
        companyDefunct=(
            product.company_defunct if product.company_defunct is not None else False
        ),
        isDemo=product.is_demo if product.is_demo is not None else False,
        pricing=pricing,
        lastUpdated=product.last_updated.isoformat() if product.last_updated else None,
        updatedAt=product.updated_at.isoformat() if product.updated_at else None,
        scoring=scoring,
        scoreTotal=score_total,
        scoreLabel=score_label,
        scoringCriteria=product.scoring_criteria if include_scoring else None,
        audiencePriorities=product.audience_priorities or {},
        problemsPriorities=product.problems_priorities or {},
    )


def get_all_products(
    db: Session,
    limit: int | None = None,
    offset: int = 0,
    include_all: bool = False,
    include_scoring: bool = False,
) -> list[ProductResponse]:
    query = db.query(Product)
    if not include_all:
        query = query.filter(
            Product.is_visible == True, Product.company_defunct == False
        )
    query = query.order_by(Product.name).offset(offset)
    if limit is not None:
        query = query.limit(limit)
    products = query.all()
    return [_to_response(p, include_scoring=include_scoring) for p in products]


def count_products(db: Session, include_all: bool = False) -> int:
    query = db.query(Product)
    if not include_all:
        query = query.filter(
            Product.is_visible == True, Product.company_defunct == False
        )
    return query.count()


def get_product_by_id(
    db: Session, product_id: str, include_scoring: bool = False
) -> ProductResponse | None:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    return _to_response(product, include_scoring=include_scoring)


def create_product(db: Session, data: ProductCreate) -> ProductResponse:
    from datetime import date as date_type

    product = Product(
        id=data.id,
        name=data.name,
        tagline=data.tagline,
        description=data.description,
        url=data.url,
        logo=data.logo,
        tags=data.tags,
        audience=data.audience,
        problems_solved=data.problemsSolved,
        preference_match=data.preferenceMatch,
        is_mentaltech_member=data.isMentaltechMember,
        pricing_model=data.pricing.model if data.pricing else None,
        pricing_amount=data.pricing.amount if data.pricing else None,
        pricing_details=data.pricing.details if data.pricing else None,
        last_updated=(
            date_type.fromisoformat(data.lastUpdated) if data.lastUpdated else None
        ),
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
        audience_priorities=(
            data.audiencePriorities.model_dump() if data.audiencePriorities else {}
        ),
        problems_priorities=(
            data.problemsPriorities.model_dump() if data.problemsPriorities else {}
        ),
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_response(product)


def update_product(
    db: Session, product_id: str, data: ProductUpdate
) -> ProductResponse | None:
    from datetime import date as date_type

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    update_data = data.model_dump(exclude_unset=True)

    field_mapping = {
        "problemsSolved": "problems_solved",
        "preferenceMatch": "preference_match",
        "isMentaltechMember": "is_mentaltech_member",
        "isVisible": "is_visible",
        "companyDefunct": "company_defunct",
        "isDemo": "is_demo",
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
        "audiencePriorities": "audience_priorities",
        "problemsPriorities": "problems_priorities",
    }

    for camel_key, snake_key in field_mapping.items():
        if camel_key in update_data:
            value = update_data.pop(camel_key)
            if camel_key == "lastUpdated" and value:
                value = date_type.fromisoformat(value)
            if camel_key in ("audiencePriorities", "problemsPriorities"):
                value = to_dict(value)
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
