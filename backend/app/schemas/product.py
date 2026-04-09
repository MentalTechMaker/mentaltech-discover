from pydantic import BaseModel, ConfigDict, Field, field_validator


class PricingSchema(BaseModel):
    model: str | None = None
    amount: str | None = None
    details: str | None = None


class ScoringSchema(BaseModel):
    security: int | None = None
    efficacy: int | None = None
    accessibility: int | None = None
    ux: int | None = None
    support: int | None = None
    justificationSecurity: str | None = None
    justificationEfficacy: str | None = None
    justificationAccessibility: str | None = None
    justificationUx: str | None = None
    justificationSupport: str | None = None


VALID_AUDIENCES = {
    "adult",
    "young",
    "child",
    "parent",
    "senior",
    "entreprise",
    "etablissement-sante",
}
VALID_PROBLEMS = {
    "stress-anxiety",
    "sadness",
    "addiction",
    "trauma",
    "work",
    "sleep",
    "cognitif",
    "douleur",
    "concentration",
    "other",
}
VALID_PRIORITY_VALUES = VALID_AUDIENCES | VALID_PROBLEMS


class PriorityMapSchema(BaseModel):
    P1: list[str] = []
    P2: list[str] = []
    P3: list[str] = []

    @field_validator("P1", "P2", "P3")
    @classmethod
    def validate_priority_list(cls, v: list[str]) -> list[str]:
        if len(v) > 1:
            raise ValueError("Maximum 1 item par niveau de priorite")
        for item in v:
            if item not in VALID_PRIORITY_VALUES:
                raise ValueError(f"Valeur invalide: {item}")
        if len(set(v)) != len(v):
            raise ValueError("Doublons non autorises")
        return v


class ProductResponse(BaseModel):
    """Response schema matching the frontend TypeScript Product interface (camelCase)."""

    id: str
    name: str

    tagline: str
    description: str
    url: str
    logo: str
    tags: list[str]
    audience: list[str]
    problemsSolved: list[str]
    preferenceMatch: list[str]
    isMentaltechMember: bool
    isVisible: bool = True
    companyDefunct: bool = False
    isDemo: bool = False
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None
    updatedAt: str | None = None
    scoring: ScoringSchema | None = None
    scoreTotal: int | None = None
    scoreLabel: str | None = None
    scoringCriteria: dict | None = None
    audiencePriorities: PriorityMapSchema | None = None
    problemsPriorities: PriorityMapSchema | None = None

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    id: str
    name: str

    tagline: str
    description: str
    url: str
    logo: str
    tags: list[str] = []
    audience: list[str] = []
    problemsSolved: list[str] = []
    preferenceMatch: list[str] = []
    isMentaltechMember: bool = False
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None
    scoreSecurity: int | None = Field(None, ge=0, le=5)
    scoreEfficacy: int | None = Field(None, ge=0, le=5)
    scoreAccessibility: int | None = Field(None, ge=0, le=5)
    scoreUx: int | None = Field(None, ge=0, le=5)
    scoreSupport: int | None = Field(None, ge=0, le=5)
    justificationSecurity: str | None = None
    justificationEfficacy: str | None = None
    justificationAccessibility: str | None = None
    justificationUx: str | None = None
    justificationSupport: str | None = None
    scoringCriteria: dict | None = None
    audiencePriorities: PriorityMapSchema | None = None
    problemsPriorities: PriorityMapSchema | None = None


class ProductUpdate(BaseModel):
    name: str | None = None

    tagline: str | None = None
    description: str | None = None
    url: str | None = None
    logo: str | None = None
    tags: list[str] | None = None
    audience: list[str] | None = None
    problemsSolved: list[str] | None = None
    preferenceMatch: list[str] | None = None
    isMentaltechMember: bool | None = None
    isVisible: bool | None = None
    companyDefunct: bool | None = None
    isDemo: bool | None = None
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None
    scoreSecurity: int | None = Field(None, ge=0, le=5)
    scoreEfficacy: int | None = Field(None, ge=0, le=5)
    scoreAccessibility: int | None = Field(None, ge=0, le=5)
    scoreUx: int | None = Field(None, ge=0, le=5)
    scoreSupport: int | None = Field(None, ge=0, le=5)
    justificationSecurity: str | None = None
    justificationEfficacy: str | None = None
    justificationAccessibility: str | None = None
    justificationUx: str | None = None
    justificationSupport: str | None = None
    scoringCriteria: dict | None = None
    audiencePriorities: PriorityMapSchema | None = None
    problemsPriorities: PriorityMapSchema | None = None


class PaginatedProducts(BaseModel):
    items: list[ProductResponse]
    total: int
    limit: int | None = None
    offset: int = 0
