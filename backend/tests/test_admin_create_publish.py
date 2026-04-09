"""Tests for admin create-and-publish endpoint."""


def _publish(client, admin_user, **overrides):
    """Helper to create and publish a product via admin."""
    payload = {
        "name": "TestProduit",
        "tagline": "Un produit test",
        "description": "Description du produit",
        "url": "https://testproduit.fr",
        "logo": "/uploads/logos/test.png",
        "tags": [],
        "audience": ["adult", "young"],
        "problems_solved": ["stress-anxiety", "sadness"],
        "audience_priorities": {"P1": ["adult"], "P2": ["young"], "P3": []},
        "problems_priorities": {"P1": ["stress-anxiety"], "P2": ["sadness"], "P3": []},
        "preference_match": ["talk-now", "program"],
        "is_mentaltech_member": False,
        "pricing_model": "freemium",
        "pricing_amount": "9.99/mois",
        **overrides,
    }
    return client.post(
        "/api/admin/submissions/create-and-publish",
        json=payload,
        headers=admin_user,
    )


def test_create_publish_saves_all_fields(client, admin_user, db):
    """Product is created with all fields including priorities and preference_match."""
    res = _publish(client, admin_user)
    assert res.status_code in (200, 201), res.json()

    from app.models.product import Product

    product = db.query(Product).first()
    assert product is not None
    assert product.name == "TestProduit"
    assert product.preference_match == ["talk-now", "program"]
    assert product.audience_priorities == {"P1": ["adult"], "P2": ["young"], "P3": []}
    assert product.problems_priorities == {"P1": ["stress-anxiety"], "P2": ["sadness"], "P3": []}
    assert product.logo == "/uploads/logos/test.png"
    assert product.pricing_model == "freemium"
    assert product.is_mentaltech_member is False


def test_create_publish_without_optional_fields(client, admin_user, db):
    """Product creation works without optional fields."""
    res = _publish(client, admin_user, logo=None, pricing_model=None, pricing_amount=None)
    assert res.status_code in (200, 201)

    from app.models.product import Product

    product = db.query(Product).first()
    assert product is not None
    assert product.logo == ""
    assert product.pricing_model is None


def test_create_publish_returns_product_response(client, admin_user):
    """Response includes the created product with correct structure."""
    res = _publish(client, admin_user)
    assert res.status_code in (200, 201)
    data = res.json()
    assert data["name"] == "TestProduit"
    assert data["preferenceMatch"] == ["talk-now", "program"]
    assert data["audiencePriorities"]["P1"] == ["adult"]


def test_create_publish_upsert(client, admin_user, db):
    """Publishing with same ID updates instead of duplicating."""
    _publish(client, admin_user, id="test-id", name="V1")
    res = _publish(client, admin_user, id="test-id", name="V2")
    assert res.status_code in (200, 201)

    from app.models.product import Product

    products = db.query(Product).all()
    assert len(products) == 1
    assert products[0].name == "V2"


def test_create_publish_requires_admin(client, auth_headers):
    """Non-admin users cannot create products."""
    res = client.post(
        "/api/admin/submissions/create-and-publish",
        json={"name": "Test", "tagline": "t", "description": "d", "url": "https://t.com"},
        headers=auth_headers,
    )
    assert res.status_code == 403


def test_create_publish_no_auth(client):
    """Unauthenticated requests are rejected."""
    res = client.post(
        "/api/admin/submissions/create-and-publish",
        json={"name": "Test", "tagline": "t", "description": "d", "url": "https://t.com"},
    )
    assert res.status_code in (401, 403)
