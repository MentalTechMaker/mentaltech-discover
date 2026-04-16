"""Tests for authentication endpoints."""


class TestRegister:
    def test_register_success(self, client):
        res = client.post("/api/auth/register", json={
            "email": "new@example.com",
            "password": "StrongPass1",
            "name": "New User",
        })
        assert res.status_code == 201
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_register_duplicate_email(self, client, registered_user):
        res = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "password": "StrongPass1",
            "name": "Another User",
        })
        assert res.status_code == 409

    def test_register_weak_password(self, client):
        res = client.post("/api/auth/register", json={
            "email": "weak@example.com",
            "password": "short",
            "name": "Weak User",
        })
        assert res.status_code == 400

    def test_register_no_uppercase(self, client):
        res = client.post("/api/auth/register", json={
            "email": "weak@example.com",
            "password": "alllowercase1",
            "name": "Weak User",
        })
        assert res.status_code == 400

    def test_register_no_digit(self, client):
        res = client.post("/api/auth/register", json={
            "email": "weak@example.com",
            "password": "NoDigitsHere",
            "name": "Weak User",
        })
        assert res.status_code == 400


class TestLogin:
    def test_login_success(self, client, registered_user):
        creds = registered_user["credentials"]
        res = client.post("/api/auth/login", json={
            "email": creds["email"],
            "password": creds["password"],
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data

    def test_login_wrong_password(self, client, registered_user):
        res = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "WrongPass1",
        })
        assert res.status_code == 401

    def test_login_nonexistent_email(self, client):
        res = client.post("/api/auth/login", json={
            "email": "nobody@example.com",
            "password": "SomePass1",
        })
        assert res.status_code == 401


class TestMe:
    def test_me_authenticated(self, client, auth_headers):
        res = client.get("/api/auth/me", headers=auth_headers)
        assert res.status_code == 200
        data = res.json()
        assert data["email"] == "test@example.com"
        assert data["name"] == "Test User"
        assert data["role"] == "user"
        assert data["email_verified"] is False

    def test_me_unauthenticated(self, client):
        res = client.get("/api/auth/me")
        assert res.status_code == 403


class TestChangePassword:
    def test_change_password_success(self, client, registered_user, auth_headers):
        res = client.put("/api/auth/change-password", headers=auth_headers, json={
            "current_password": "TestPass1",
            "new_password": "NewStrong1",
        })
        assert res.status_code == 200

        # Verify new password works
        res = client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "NewStrong1",
        })
        assert res.status_code == 200

    def test_change_password_wrong_current(self, client, registered_user, auth_headers):
        res = client.put("/api/auth/change-password", headers=auth_headers, json={
            "current_password": "WrongPass1",
            "new_password": "NewStrong1",
        })
        assert res.status_code == 400

    def test_change_password_weak_new(self, client, registered_user, auth_headers):
        res = client.put("/api/auth/change-password", headers=auth_headers, json={
            "current_password": "TestPass1",
            "new_password": "weak",
        })
        assert res.status_code == 400


class TestForgotPassword:
    def test_forgot_password_existing_email(self, client, registered_user):
        res = client.post("/api/auth/forgot-password", json={
            "email": "test@example.com",
        })
        assert res.status_code == 200

    def test_forgot_password_nonexistent_email(self, client):
        """Should return 200 to prevent email enumeration."""
        res = client.post("/api/auth/forgot-password", json={
            "email": "nobody@example.com",
        })
        assert res.status_code == 200


class TestHealth:
    def test_health_endpoint(self, client):
        res = client.get("/api/health")
        assert res.status_code == 200
        assert res.json() == {"status": "ok"}
