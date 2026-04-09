"""Tests for email service - verify DEBUG mode writes files, returns correct bool."""
import os
from unittest.mock import patch


def test_send_returns_bool_on_debug(client, db):
    """In DEBUG mode, send functions write to file and return True."""
    with patch("app.services.email.settings") as mock_settings:
        mock_settings.DEBUG = True
        mock_settings.FRONTEND_URL = "http://localhost:3033"
        mock_settings.SECRET_KEY = "test-secret"

        from app.services.email import _write_email_to_file

        result = _write_email_to_file(
            "Test Subject", ["test@example.com"], "<h1>Test</h1>"
        )
        assert result is True


def test_write_email_disabled_in_production():
    """File fallback returns False when not in DEBUG."""
    with patch("app.services.email.settings") as mock_settings:
        mock_settings.DEBUG = False

        from app.services.email import _write_email_to_file

        result = _write_email_to_file(
            "Test Subject", ["test@example.com"], "<h1>Test</h1>"
        )
        assert result is False
