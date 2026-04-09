import re

from pydantic import BaseModel

from ...models.product_submission import ProductSubmission
from ...models.health_prof_application import HealthProfApplication
from ...schemas.publisher import SubmissionResponse
from ...schemas.public_submission import HealthProfApplicationResponse


class CollectiveMemberUpdate(BaseModel):
    is_collective_member: bool = False


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àâä]", "a", text)
    text = re.sub(r"[éèêë]", "e", text)
    text = re.sub(r"[ïî]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ùûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:100]


def _sub_to_response(sub: ProductSubmission) -> SubmissionResponse:
    return SubmissionResponse(
        id=str(sub.id),
        publisherId=str(sub.publisher_id),
        productId=sub.product_id,
        status=sub.status,
        name=sub.name,
        tagline=sub.tagline,
        description=sub.description,
        url=sub.url,
        logo=sub.logo,
        tags=sub.tags or [],
        audience=sub.audience or [],
        problemsSolved=sub.problems_solved or [],
        audiencePriorities=sub.audience_priorities or {},
        problemsPriorities=sub.problems_priorities or {},
        pricingModel=sub.pricing_model,
        pricingAmount=sub.pricing_amount,
        pricingDetails=sub.pricing_details,
        protocolAnswers=sub.protocol_answers or {},
        adminNotes=sub.admin_notes,
        reviewedAt=sub.reviewed_at.isoformat() if sub.reviewed_at else None,
        createdAt=sub.created_at.isoformat(),
        updatedAt=sub.updated_at.isoformat(),
    )


def _health_pro_to_response(
    app: HealthProfApplication,
) -> HealthProfApplicationResponse:
    return HealthProfApplicationResponse(
        id=str(app.id),
        name=app.name,
        email=app.email,
        profession=app.profession,
        rppsAdeli=app.rpps_adeli,
        organization=app.organization,
        motivation=app.motivation,
        status=app.status,
        emailConfirmed=app.email_confirmed,
        isCollectiveMember=app.is_collective_member,
        adminNotes=app.admin_notes,
        createdAt=app.created_at.isoformat(),
        updatedAt=app.updated_at.isoformat(),
    )
