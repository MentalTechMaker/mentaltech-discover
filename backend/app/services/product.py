from sqlalchemy.orm import Session

from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, PricingSchema


def _to_response(product: Product) -> ProductResponse:
    """Map a SQLAlchemy Product (snake_case) to a ProductResponse (camelCase)."""
    pricing = None
    if product.pricing_model or product.pricing_amount or product.pricing_details:
        pricing = PricingSchema(
            model=product.pricing_model,
            amount=product.pricing_amount,
            details=product.pricing_details,
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
        pricing=pricing,
        lastUpdated=product.last_updated.isoformat() if product.last_updated else None,
    )


def get_all_products(db: Session) -> list[ProductResponse]:
    products = db.query(Product).order_by(Product.name).all()
    return [_to_response(p) for p in products]


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
        pricing_model=data.pricing.model if data.pricing else None,
        pricing_amount=data.pricing.amount if data.pricing else None,
        pricing_details=data.pricing.details if data.pricing else None,
        last_updated=date_type.fromisoformat(data.lastUpdated) if data.lastUpdated else None,
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
        "lastUpdated": "last_updated",
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
