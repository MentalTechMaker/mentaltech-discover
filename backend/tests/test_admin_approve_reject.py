"""Tests for admin approve/reject flows on public submissions."""
import time


def _create_submission(client, db, status="submitted"):
    """Create a submission and optionally set its status."""
    from app.models.public_submission import PublicSubmission

    payload = {
        "contact_name": "Test Contact",
        "contact_email": "contact@example.com",
        "honeypot": "",
        "submitted_at_ts": time.time() - 10,
        "name": "SolutionTest",
        "tagline": "Tagline test",
        "description": "Description test",
        "url": "https://solution.test",
        "audience": ["adult"],
        "problems_solved": ["stress-anxiety"],
        "audience_priorities": {"P1": ["adult"], "P2": [], "P3": []},
        "problems_priorities": {"P1": ["stress-anxiety"], "P2": [], "P3": []},
        "preference_match": ["autonomous", "understand"],
        "collectif_requested": True,
        "collectif_ca_range": "less-100k",
    }
    res = client.post("/api/public/submissions", json=payload)
    sub_id = res.json()["id"]

    sub = db.query(PublicSubmission).filter(PublicSubmission.id == sub_id).first()
    sub.status = status
    sub.email_confirmed = True
    db.commit()
    db.refresh(sub)
    return sub_id


def test_approve_creates_product(client, admin_user, db):
    """Approving a submission creates a product with correct data."""
    sub_id = _create_submission(client, db)

    res = client.post(
        f"/api/admin/public-submissions/{sub_id}/approve",
        json={},
        headers=admin_user,
    )
    assert res.status_code == 200, res.json()

    data = res.json()
    assert data["status"] == "approved"
    assert data["productId"] is not None

    from app.models.product import Product

    product = db.query(Product).filter(Product.id == data["productId"]).first()
    assert product is not None
    assert product.name == "SolutionTest"
    assert product.preference_match == ["autonomous", "understand"]
    assert product.audience_priorities == {"P1": ["adult"], "P2": [], "P3": []}


def test_reject_submission(client, admin_user, db):
    """Rejecting a submission sets status and purges CA range."""
    sub_id = _create_submission(client, db)

    res = client.post(
        f"/api/admin/public-submissions/{sub_id}/reject",
        json={"admin_notes": "Pas pertinent"},
        headers=admin_user,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "rejected"
    assert data["adminNotes"] == "Pas pertinent"
    assert data["collectifCaRange"] == "less-100k"  # Data preserved


def test_reject_approved_submission(client, admin_user, db):
    """Can reject an already approved submission."""
    sub_id = _create_submission(client, db, status="approved")

    res = client.post(
        f"/api/admin/public-submissions/{sub_id}/reject",
        json={"admin_notes": "Revoked"},
        headers=admin_user,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "rejected"


def test_approve_requires_admin(client, auth_headers, db):
    """Non-admin cannot approve."""
    sub_id = _create_submission(client, db)
    res = client.post(
        f"/api/admin/public-submissions/{sub_id}/approve",
        json={},
        headers=auth_headers,
    )
    assert res.status_code == 403


def test_approve_nonexistent(client, admin_user):
    """Approving nonexistent submission returns 404."""
    res = client.post(
        "/api/admin/public-submissions/00000000-0000-0000-0000-000000000000/approve",
        json={},
        headers=admin_user,
    )
    assert res.status_code == 404


def test_collectif_status_independent(client, admin_user, db):
    """Collectif status can be changed independently of submission status."""
    sub_id = _create_submission(client, db)

    # Approve submission
    client.post(
        f"/api/admin/public-submissions/{sub_id}/approve",
        json={},
        headers=admin_user,
    )

    # Refuse collectif separately
    res = client.post(
        f"/api/admin/public-submissions/{sub_id}/collectif-status",
        json={"collectif_status": "refused", "admin_notes": "Pas eligible"},
        headers=admin_user,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "approved"
    assert data["collectifStatus"] == "refused"
