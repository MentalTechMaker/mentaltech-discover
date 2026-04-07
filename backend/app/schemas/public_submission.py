from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from .product import PriorityMapSchema

VALID_PROFESSIONS = [
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


class PublicSubmissionCreate(BaseModel):
    # Contact info (required)
    contact_name: str = Field(max_length=200)
    contact_email: EmailStr

    # Anti-bot fields
    honeypot: str = ""
    submitted_at_ts: float = 0.0

    # Product info (all optional)
    name: str | None = Field(default=None, max_length=200)
    type: str | None = None
    tagline: str | None = Field(default=None, max_length=300)
    description: str | None = Field(default=None, max_length=10000)
    url: str | None = Field(default=None, max_length=500)
    linkedin: str | None = Field(default=None, max_length=500)
    logo: str | None = None
    tags: list[str] = []
    audience: list[str] = []
    problems_solved: list[str] = []
    audience_priorities: PriorityMapSchema = PriorityMapSchema()
    problems_priorities: PriorityMapSchema = PriorityMapSchema()
    pricing_model: str | None = None
    pricing_amount: str | None = None
    pricing_details: str | None = None
    protocol_answers: dict = {}

    # Collectif (CA range stored temporarily for admin review)
    collectif_requested: bool = False
    collectif_ca_range: str | None = None
    collectif_contact_email: EmailStr | None = None


class PublicSubmissionResponse(BaseModel):
    id: str
    contactName: str
    contactEmail: str
    status: str
    name: str | None
    type: str | None
    tagline: str | None
    description: str | None
    url: str | None
    linkedin: str | None
    logo: str | None
    tags: list[str]
    audience: list[str]
    problemsSolved: list[str]
    audiencePriorities: dict | None = None
    problemsPriorities: dict | None = None
    pricingModel: str | None
    pricingAmount: str | None
    pricingDetails: str | None
    protocolAnswers: dict
    collectifRequested: bool
    collectifCaRange: str | None
    collectifStatus: str
    collectifContactEmail: str | None
    adminNotes: str | None
    productId: str | None
    reviewedAt: str | None
    createdAt: str
    updatedAt: str

    model_config = ConfigDict(from_attributes=True)


class HealthProfApplicationCreate(BaseModel):
    name: str = Field(max_length=200)
    email: EmailStr
    profession: str
    rpps_adeli: str | None = None
    organization: str | None = Field(default=None, max_length=300)
    motivation: str | None = Field(default=None, max_length=5000)
    linkedin: str | None = Field(default=None, max_length=500)

    # Anti-bot
    honeypot: str = ""
    submitted_at_ts: float = 0.0

    @field_validator("profession")
    @classmethod
    def validate_profession(cls, v: str) -> str:
        if v not in VALID_PROFESSIONS:
            raise ValueError(
                f"Profession invalide. Valeurs acceptées: {', '.join(VALID_PROFESSIONS)}"
            )
        return v


class HealthProfApplicationResponse(BaseModel):
    id: str
    name: str
    email: str
    profession: str
    rppsAdeli: str | None
    organization: str | None
    motivation: str | None
    linkedin: str | None
    status: str
    emailConfirmed: bool
    isCollectiveMember: bool
    adminNotes: str | None
    createdAt: str
    updatedAt: str

    model_config = ConfigDict(from_attributes=True)


class AdminCollectifAction(BaseModel):
    collectif_status: str  # discussing | accepted | refused
    admin_notes: str | None = None
    helloasso_url: str | None = None


class AdminSimpleAction(BaseModel):
    admin_notes: str | None = None
    helloasso_url: str | None = None
