from pydantic import BaseModel


class FavoriteToggle(BaseModel):
    product_id: str


class FavoriteResponse(BaseModel):
    id: str
    productId: str
    createdAt: str

    model_config = {"from_attributes": True}


class NoteUpsert(BaseModel):
    product_id: str
    content: str


class NoteResponse(BaseModel):
    id: str
    productId: str
    content: str
    createdAt: str
    updatedAt: str

    model_config = {"from_attributes": True}


class ProductUpdateResponse(BaseModel):
    id: str
    productId: str
    productName: str | None = None
    updateType: str
    title: str
    description: str | None = None
    createdAt: str

    model_config = {"from_attributes": True}


class ProductUpdateCreate(BaseModel):
    product_id: str
    update_type: str
    title: str
    description: str | None = None


class CommunityStats(BaseModel):
    productId: str
    productName: str
    prescriberCount: int
    prescriptionCount: int


class PrescriberListItem(BaseModel):
    id: str
    email: str
    name: str
    profession: str | None = None
    organization: str | None = None
    rpps_adeli: str | None = None
    is_verified_prescriber: bool
    created_at: str

    model_config = {"from_attributes": True}
