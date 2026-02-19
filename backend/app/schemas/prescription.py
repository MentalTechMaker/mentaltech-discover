from pydantic import BaseModel


class PrescriptionCreate(BaseModel):
    patient_name: str | None = None
    patient_email: str | None = None
    product_ids: list[str]
    message: str | None = None


class PrescriptionResponse(BaseModel):
    id: str
    prescriberId: str
    prescriberName: str | None = None
    patientName: str | None = None
    patientEmail: str | None = None
    productIds: list[str]
    message: str | None = None
    token: str
    link: str
    expiresAt: str
    viewedAt: str | None = None
    createdAt: str

    model_config = {"from_attributes": True}


class PrescriptionPublicResponse(BaseModel):
    prescriberName: str
    prescriberProfession: str | None = None
    prescriberOrganization: str | None = None
    patientName: str | None = None
    message: str | None = None
    products: list[dict]
    createdAt: str
    expired: bool


class PrescriptionStats(BaseModel):
    total: int
    thisMonth: int
    viewed: int
    topProducts: list[dict]
