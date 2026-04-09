"""Shared utility functions."""


def to_dict(val) -> dict:
    """Convert a Pydantic model or dict to a plain dict."""
    if hasattr(val, "model_dump"):
        return val.model_dump()
    return val or {}


def public_submission_to_response(sub):
    """Convert a PublicSubmission model to PublicSubmissionResponse."""
    from .schemas.public_submission import PublicSubmissionResponse

    return PublicSubmissionResponse(
        id=str(sub.id),
        contactName=sub.contact_name,
        contactEmail=sub.contact_email,
        status=sub.status,
        name=sub.name,
        tagline=sub.tagline,
        description=sub.description,
        url=sub.url,
        linkedin=sub.linkedin,
        logo=sub.logo,
        tags=sub.tags or [],
        audience=sub.audience or [],
        problemsSolved=sub.problems_solved or [],
        audiencePriorities=sub.audience_priorities or {},
        problemsPriorities=sub.problems_priorities or {},
        preferenceMatch=sub.preference_match or [],
        pricingModel=sub.pricing_model,
        pricingAmount=sub.pricing_amount,
        pricingDetails=sub.pricing_details,
        protocolAnswers=sub.protocol_answers or {},
        collectifRequested=sub.collectif_requested,
        collectifCaRange=sub.collectif_ca_range,
        collectifStatus=sub.collectif_status,
        collectifContactEmail=sub.collectif_contact_email,
        adminNotes=sub.admin_notes,
        productId=sub.product_id,
        reviewedAt=sub.reviewed_at.isoformat() if sub.reviewed_at else None,
        createdAt=sub.created_at.isoformat(),
        updatedAt=sub.updated_at.isoformat(),
    )


def validate_magic_bytes(content: bytes, content_type: str) -> bool:
    """Validate file content matches declared MIME type via magic bytes."""
    if content_type == "image/png":
        return content[:4] == b"\x89PNG"
    elif content_type == "image/jpeg":
        return content[:3] == b"\xff\xd8\xff"
    elif content_type == "image/webp":
        return content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    return False
