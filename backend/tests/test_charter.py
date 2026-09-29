"""Tests for the charter signature flow: sign -> confirm -> public list."""
import time


def _sign(client, **overrides):
    payload = {
        "name": "Jean Dupont",
        "organization": "Ma Structure",
        "email": "jean@example.com",
        "kind": "company",
        "consent": True,
        "honeypot": "",
        "submitted_at_ts": time.time() - 10,
        **overrides,
    }
    return client.post("/api/charter/sign", json=payload)


def test_sign_creates_pending_signatory(client, db):
    res = _sign(client)
    assert res.status_code == 201
    data = res.json()
    assert "id" in data
    assert data["email_sent"] is True

    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == data["id"]).first()
    assert sig is not None
    assert sig.status == "pending_email"
    assert sig.email_confirmed is False
    assert sig.source == "form"
    assert sig.confirm_token is not None


def test_sign_without_consent_rejected(client):
    res = _sign(client, consent=False)
    assert res.status_code == 422


def test_sign_invalid_kind_rejected(client):
    res = _sign(client, kind="not-a-kind")
    assert res.status_code == 422


def test_sign_duplicate_confirmed_email_rejected(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    sig.email_confirmed = True
    db.commit()

    res2 = _sign(client)
    assert res2.status_code == 409


def test_confirm_with_valid_token_marks_confirmed(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    token = sig.confirm_token

    confirm_res = client.get(f"/api/charter/confirm?token={token}")
    assert confirm_res.status_code == 200
    assert "Signature confirmée" in confirm_res.text

    db.refresh(sig)
    assert sig.email_confirmed is True
    assert sig.status == "confirmed"
    assert sig.signed_at is not None
    assert sig.confirm_token is None


def test_confirm_with_invalid_token_returns_400(client):
    res = client.get("/api/charter/confirm?token=not-a-real-token")
    assert res.status_code == 400


def test_signatories_list_excludes_unconfirmed(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    token = sig.confirm_token

    # Not confirmed yet: absent from the public list.
    list_res = client.get("/api/charter/signatories")
    assert list_res.status_code == 200
    assert list_res.json() == []

    client.get(f"/api/charter/confirm?token={token}")

    list_res = client.get("/api/charter/signatories")
    assert list_res.status_code == 200
    names = [s["organization"] for s in list_res.json()]
    assert "Ma Structure" in names


def test_signatories_list_never_exposes_email(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    client.get(f"/api/charter/confirm?token={sig.confirm_token}")

    list_res = client.get("/api/charter/signatories")
    assert "email" not in list_res.json()[0]
    assert "jean@example.com" not in list_res.text


def test_sign_defaults_interested_in_soutien_to_false(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    assert sig.interested_in_soutien is False


def test_sign_stores_interested_in_soutien(client, db):
    res = _sign(client, interested_in_soutien=True)
    assert res.status_code == 201
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    assert sig.interested_in_soutien is True


def test_sign_accepts_payload_as_sent_by_website(client, db):
    # mentaltech.fr poste Object.fromEntries(FormData) : les cases cochees
    # arrivent en chaine "true", les cases decochees sont absentes.
    payload = {
        "name": "Jean Dupont",
        "organization": "Ma Structure",
        "email": "jean@example.com",
        "kind": "institution",
        "consent": "true",
        "interested_in_soutien": "true",
        "honeypot": "",
        "submitted_at_ts": time.time() - 10,
    }
    res = client.post("/api/charter/sign", json=payload)
    assert res.status_code == 201
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    assert sig.interested_in_soutien is True


def test_sign_rejects_filled_honeypot(client):
    res = _sign(client, honeypot="http://spam.example")
    assert res.status_code == 400


def test_sign_rejects_too_fast_submission(client):
    res = _sign(client, submitted_at_ts=time.time())
    assert res.status_code == 400


def test_admin_notification_mentions_soutien():
    import asyncio
    from unittest.mock import patch
    from app.services import email as email_service

    captured = {}

    async def fake_send(message, recipients, html, label):
        captured["html"] = html
        return True

    with patch.object(email_service, "_send_or_write", fake_send):
        asyncio.run(email_service.send_charter_admin_notification(
            admin_email="admin@example.com", name="A", organization="B",
            email="a@b.fr", kind="company", interested_in_soutien=True,
        ))
        assert "soutien financier" in captured["html"]
        asyncio.run(email_service.send_charter_admin_notification(
            admin_email="admin@example.com", name="A", organization="B",
            email="a@b.fr", kind="company",
        ))
        assert "soutien financier" not in captured["html"]


def test_confirm_twice_says_already_confirmed(client, db):
    res = _sign(client)
    from app.models.charter_signatory import CharterSignatory

    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    token = sig.confirm_token

    assert client.get(f"/api/charter/confirm?token={token}").status_code == 200
    second = client.get(f"/api/charter/confirm?token={token}")
    assert second.status_code == 200
    assert "Déjà confirmée" in second.text


def test_confirm_with_superseded_token_returns_404(client, db):
    from app.models.charter_signatory import CharterSignatory

    res = _sign(client)
    sig = db.query(CharterSignatory).filter(CharterSignatory.id == res.json()["id"]).first()
    old_token = sig.confirm_token
    time.sleep(1.1)  # iat a la seconde : garantit un nouveau token
    _sign(client)  # redemande : nouveau token, l'ancien ne vaut plus
    db.refresh(sig)
    assert sig.confirm_token != old_token

    res = client.get(f"/api/charter/confirm?token={old_token}")
    assert res.status_code == 404
    db.refresh(sig)
    assert sig.email_confirmed is False
