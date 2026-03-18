from pydantic import BaseModel, EmailStr


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
