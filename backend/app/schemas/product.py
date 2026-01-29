from pydantic import BaseModel, ConfigDict


class PricingSchema(BaseModel):
    model: str | None = None
    amount: str | None = None
    details: str | None = None


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
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None

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
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None


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
    pricing: PricingSchema | None = None
    lastUpdated: str | None = None
