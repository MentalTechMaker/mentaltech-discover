from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

VALID_KINDS = ["company", "institution", "individual"]


class CharterSignatoryCreate(BaseModel):
    name: str = Field(max_length=200)
    organization: str = Field(max_length=200)
    email: EmailStr
    kind: str
    consent: bool

    # Anti-bot, memes conventions que public_submission / health_prof_application.
    honeypot: str = ""
    submitted_at_ts: float = 0.0

    @field_validator("kind")
    @classmethod
    def validate_kind(cls, v: str) -> str:
        if v not in VALID_KINDS:
            raise ValueError(f"kind invalide. Valeurs acceptees : {', '.join(VALID_KINDS)}")
        return v

    @field_validator("consent")
    @classmethod
    def validate_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Le consentement est obligatoire pour signer la charte.")
        return v


class CharterSignatoryPublic(BaseModel):
    """Liste publique des signataires confirmes. Pas d'email : le consentement
    porte sur la publication du nom et de l'organisation, pas de l'adresse."""

    name: str
    organization: str
    kind: str
    signedAt: str

    model_config = ConfigDict(from_attributes=True)
