import re

from pydantic import BaseModel, EmailStr, Field, field_validator

VALID_PRESCRIBER_PROFESSIONS = [
    "Médecin généraliste",
    "Médecin du travail",
    "Psychiatre",
    "Pédopsychiatre",
    "Psychologue",
    "Neuropsychologue",
    "Infirmier(e) en pratique avancée",
    "Infirmier(e) en psychiatrie",
    "Ergothérapeute",
    "Orthophoniste",
    "Psychomotricien(ne)",
    "Assistant(e) social(e)",
    "Éducateur(trice) spécialisé(e)",
    "Conseiller(e) en économie sociale et familiale",
    "Sage-femme",
    "Pharmacien(ne)",
    "Addictologue",
    "Pair-aidant(e) professionnel(le)",
    "Coach en santé mentale",
    "Psychothérapeute",
    "Médecin scolaire",
    "Infirmier(e) scolaire",
    "Autre professionnel de santé",
]


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(max_length=200)
    name: str = Field(max_length=200)


class PrescriberRegister(BaseModel):
    email: EmailStr
    password: str = Field(max_length=200)
    name: str = Field(max_length=200)
    profession: str
    organization: str | None = Field(default=None, max_length=300)
    rpps_adeli: str | None = None

    @field_validator("profession")
    @classmethod
    def validate_profession(cls, v: str) -> str:
        if v not in VALID_PRESCRIBER_PROFESSIONS:
            raise ValueError(
                f"Profession invalide. Valeurs acceptées: {', '.join(VALID_PRESCRIBER_PROFESSIONS)}"
            )
        return v

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
