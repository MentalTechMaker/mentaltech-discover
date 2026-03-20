import re

from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str


class PrescriberRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    profession: str
    organization: str | None = None
    rpps_adeli: str | None = None

    @field_validator("rpps_adeli")
    @classmethod
    def validate_rpps_adeli(cls, v: str | None) -> str | None:
        if v is None or v.strip() == "":
            return v
        v = v.strip()
        if re.fullmatch(r"\d{11}", v):
            return v  # Valid RPPS (11 digits)
        if re.fullmatch(r"\d{9}", v):
            return v  # Valid ADELI (9 digits)
        raise ValueError("Format RPPS (11 chiffres) ou ADELI (9 chiffres) invalide")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    email_verified: bool = False
    profession: str | None = None
    organization: str | None = None
    rpps_adeli: str | None = None
    is_verified_prescriber: bool = False
    company_name: str | None = None
    siret: str | None = None
    company_website: str | None = None
    is_verified_publisher: bool = False

    model_config = {"from_attributes": True}


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str
