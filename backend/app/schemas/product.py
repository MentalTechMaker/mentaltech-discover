from pydantic import BaseModel, ConfigDict, Field


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


class ProductResponse(BaseModel):
    """Response schema matching the frontend TypeScript Product interface (camelCase)."""
    id: str
    name: str
    type: str
    tagline: str
    description: str
    url: str
    logo: str
    tags: list[str]
    audience: list[str]
    problemsSolved: list[str]
    preferenceMatch: list[str]
    forCompany: bool
    isMentaltechMember: bool
    isVisible: bool = True
    companyDefunct: bool = False
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None
    scoring: ScoringSchema | None = None
    scoreTotal: int | None = None
    scoreLabel: str | None = None
    scoringCriteria: dict | None = None

    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    id: str
    name: str
    type: str
    tagline: str
    description: str
    url: str
    logo: str
    tags: list[str] = []
    audience: list[str] = []
    problemsSolved: list[str] = []
    preferenceMatch: list[str] = []
    forCompany: bool = False
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


class ProductUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    tagline: str | None = None
    description: str | None = None
    url: str | None = None
    logo: str | None = None
    tags: list[str] | None = None
    audience: list[str] | None = None
    problemsSolved: list[str] | None = None
    preferenceMatch: list[str] | None = None
    forCompany: bool | None = None
    isMentaltechMember: bool | None = None
    isVisible: bool | None = None
    companyDefunct: bool | None = None
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


class PaginatedProducts(BaseModel):
    items: list[ProductResponse]
    total: int
    limit: int | None = None
    offset: int = 0
