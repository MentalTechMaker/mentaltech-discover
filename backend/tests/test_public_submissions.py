"""Tests for public submission flow: submit -> confirm -> admin review."""
import time


def _submit(client, **overrides):
    """Helper to create a public submission."""
    payload = {
        "contact_name": "Jean Dupont",
        "contact_email": "jean@example.com",
        "honeypot": "",
        "submitted_at_ts": time.time() - 10,
        "name": "MaSolution",
        "tagline": "Une solution de sante mentale",
        "description": "Description de la solution",
        "url": "https://masolution.fr",
        "audience": ["adult"],
        "problems_solved": ["stress-anxiety"],
        "audience_priorities": {"P1": ["adult"], "P2": [], "P3": []},
        "problems_priorities": {"P1": ["stress-anxiety"], "P2": [], "P3": []},
        "preference_match": ["talk-now", "autonomous"],
        "pricing_model": "free",
        **overrides,
    }
    return client.post("/api/public/submissions", json=payload)


def test_submit_saves_all_fields(client, db):
    """Submission saves preference_match, priorities, and logo."""
    res = _submit(client, logo="/uploads/logos/test.png")
    assert res.status_code == 201
    data = res.json()
    assert "id" in data

    from app.models.public_submission import PublicSubmission

    sub = db.query(PublicSubmission).filter(PublicSubmission.id == data["id"]).first()
    assert sub is not None
    assert sub.preference_match == ["talk-now", "autonomous"]
    assert sub.audience_priorities == {"P1": ["adult"], "P2": [], "P3": []}
    assert sub.problems_priorities == {"P1": ["stress-anxiety"], "P2": [], "P3": []}
    assert sub.logo == "/uploads/logos/test.png"
    assert sub.name == "MaSolution"
    assert sub.pricing_model == "free"


def test_submit_without_preference_match(client, db):
    """Submission without preference_match defaults to empty list."""
    res = _submit(client, preference_match=[])
    assert res.status_code == 201

    from app.models.public_submission import PublicSubmission

    sub = db.query(PublicSubmission).filter(PublicSubmission.id == res.json()["id"]).first()
    assert sub.preference_match == []


def test_submit_returns_email_sent(client):
    """Response includes email_sent field."""
    res = _submit(client)
    assert res.status_code == 201
    data = res.json()
    assert "email_sent" in data


def test_admin_list_submissions_returns_priorities(client, admin_user, db):
    """Admin list endpoint returns preference_match and priorities."""
    _submit(client)

    # Manually confirm email so it shows in default list
    from app.models.public_submission import PublicSubmission

    sub = db.query(PublicSubmission).first()
    sub.status = "submitted"
    sub.email_confirmed = True
    db.commit()

    res = client.get("/api/admin/public-submissions", headers=admin_user)
    assert res.status_code == 200
    subs = res.json()
    assert len(subs) >= 1
    s = subs[0]
    assert s["preferenceMatch"] == ["talk-now", "autonomous"]
    assert s["audiencePriorities"]["P1"] == ["adult"]
    assert s["problemsPriorities"]["P1"] == ["stress-anxiety"]


def test_bot_detection_honeypot(client):
    """Honeypot field filled -> rejected."""
    res = _submit(client, honeypot="spam")
    assert res.status_code == 400


def test_bot_detection_timing(client):
    """Submission too fast -> rejected."""
    res = _submit(client, submitted_at_ts=time.time())
    assert res.status_code == 400
