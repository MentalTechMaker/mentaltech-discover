"""Tests for password validation logic."""

from app.services.auth import validate_password_strength, MIN_PASSWORD_LENGTH


class TestPasswordValidation:
    def test_valid_password(self):
        assert validate_password_strength("StrongPass1") is None

    def test_too_short(self):
        result = validate_password_strength("Short1")
        assert result is not None
        assert str(MIN_PASSWORD_LENGTH) in result

    def test_no_uppercase(self):
        result = validate_password_strength("alllowercase1")
        assert result is not None
        assert "majuscule" in result

    def test_no_lowercase(self):
        result = validate_password_strength("ALLUPPERCASE1")
        assert result is not None
        assert "minuscule" in result

    def test_no_digit(self):
        result = validate_password_strength("NoDigitsHere")
        assert result is not None
        assert "chiffre" in result

    def test_minimum_valid(self):
        assert validate_password_strength("Abcdefg1") is None

    def test_empty_string(self):
        result = validate_password_strength("")
        assert result is not None
