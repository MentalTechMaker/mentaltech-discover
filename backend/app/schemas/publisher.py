from pydantic import BaseModel, ConfigDict, Field
from .product import PriorityMapSchema


class SubmissionCreate(BaseModel):
    # Basic info (all optional for draft saving)
    name: str | None = None
    type: str | None = None
    tagline: str | None = None
    description: str | None = None
    url: str | None = None
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


class SubmissionUpdate(BaseModel):
    # Same as Create but explicit partial
    name: str | None = None
    type: str | None = None
    tagline: str | None = None
    description: str | None = None
    url: str | None = None
    logo: str | None = None
    tags: list[str] | None = None
    audience: list[str] | None = None
    problems_solved: list[str] | None = None
    audience_priorities: PriorityMapSchema | None = None
    problems_priorities: PriorityMapSchema | None = None
    pricing_model: str | None = None
    pricing_amount: str | None = None
    pricing_details: str | None = None
    protocol_answers: dict | None = None


class SubmissionResponse(BaseModel):
    id: str
    publisherId: str
    productId: str | None
    status: str
    name: str | None
    type: str | None
    tagline: str | None
    description: str | None
    url: str | None
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
    adminNotes: str | None
    reviewedAt: str | None
    createdAt: str
    updatedAt: str

    model_config = ConfigDict(from_attributes=True)


class AdminReviewAction(BaseModel):
    admin_notes: str | None = None
    # Link to an already-created product instead of creating from submission data
    product_id: str | None = None
    # For approve: also set scores on the product
    score_security: int | None = Field(default=None, ge=0, le=5)
    score_efficacy: int | None = Field(default=None, ge=0, le=5)
    score_accessibility: int | None = Field(default=None, ge=0, le=5)
    score_ux: int | None = Field(default=None, ge=0, le=5)
    score_support: int | None = Field(default=None, ge=0, le=5)
    justification_security: str | None = None
    justification_efficacy: str | None = None
    justification_accessibility: str | None = None
    justification_ux: str | None = None
    justification_support: str | None = None


class AdminCreateAndPublishSchema(BaseModel):
    # Basic product info (same as SubmissionCreate)
    id: str | None = None
    name: str
    type: str
    tagline: str
    description: str
    url: str
    logo: str | None = None
    tags: list[str] = []
    audience: list[str] = []
    problems_solved: list[str] = []
    audience_priorities: PriorityMapSchema = PriorityMapSchema()
    problems_priorities: PriorityMapSchema = PriorityMapSchema()
    is_mentaltech_member: bool = False
    preference_match: list[str] = []
    pricing_model: str | None = None
    pricing_amount: str | None = None
    pricing_details: str | None = None
    protocol_answers: dict = {}
    last_updated: str | None = None
    # Scores (admin sets directly)
    score_security: int | None = Field(default=None, ge=0, le=5)
    score_efficacy: int | None = Field(default=None, ge=0, le=5)
    score_accessibility: int | None = Field(default=None, ge=0, le=5)
    score_ux: int | None = Field(default=None, ge=0, le=5)
    score_support: int | None = Field(default=None, ge=0, le=5)
    justification_security: str | None = None
    justification_efficacy: str | None = None
    justification_accessibility: str | None = None
    justification_ux: str | None = None
    justification_support: str | None = None
    scoring_criteria: dict | None = None
