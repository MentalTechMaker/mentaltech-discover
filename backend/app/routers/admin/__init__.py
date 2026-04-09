from fastapi import APIRouter

from .products import router as products_router
from .prescribers import router as prescribers_router
from .submissions import router as submissions_router
from .public_submissions import router as public_submissions_router
from .health_pro import router as health_pro_router

router = APIRouter(prefix="/api/admin", tags=["admin"])

router.include_router(products_router)
router.include_router(prescribers_router)
router.include_router(submissions_router)
router.include_router(public_submissions_router)
router.include_router(health_pro_router)
