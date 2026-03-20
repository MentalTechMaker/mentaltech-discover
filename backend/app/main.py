import logging
import logging.handlers
import time
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import SQLAlchemyError

from .config import settings
from .rate_limit import limiter
from .routers import auth, products, prescriptions, prescriber, admin, public


# --- Logging configuration ---
LOG_DIR = Path("/var/log/mentaltech")
LOG_DIR.mkdir(parents=True, exist_ok=True)

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"

logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

# File handler: rotating, 10MB max, keep 5 files
file_handler = logging.handlers.RotatingFileHandler(
    LOG_DIR / "app.log", maxBytes=10_000_000, backupCount=5, encoding="utf-8"
)
file_handler.setFormatter(logging.Formatter(LOG_FORMAT))
logging.getLogger().addHandler(file_handler)

# Error-only file for quick incident review
error_handler = logging.handlers.RotatingFileHandler(
    LOG_DIR / "error.log", maxBytes=5_000_000, backupCount=3, encoding="utf-8"
)
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(logging.Formatter(LOG_FORMAT))
logging.getLogger().addHandler(error_handler)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="MentalTech Discover API",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start) * 1000)
        # Skip noisy health checks and static files
        path = request.url.path
        if path not in ("/api/health", "/health") and not path.startswith("/uploads/"):
            logger.info(
                "%s %s %s %dms",
                request.method, path, response.status_code, duration_ms,
            )
        return response


app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
origins = [o for o in origins if o and o != "*"]  # Reject wildcard

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
)


# --- Global exception handlers (Task #4 backend) ---

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(_request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=503,
        content={"detail": "Service temporairement indisponible, veuillez réessayer"},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(_request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Erreur interne du serveur"},
    )


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(prescriptions.router)
app.include_router(prescriber.router)
app.include_router(admin.router)
app.include_router(public.router)

# Serve uploaded logos as static files (/tmp/uploads est toujours writable)
UPLOADS_DIR = Path("/tmp/uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/sitemap.xml", response_class=Response)
def sitemap_xml():
    from .database import get_db
    from .models.product import Product as ProductModel
    from datetime import date
    db = next(get_db())
    try:
        products_list = db.query(ProductModel.id, ProductModel.updated_at).filter(
            ProductModel.company_defunct.is_(False),
            ProductModel.is_visible.is_(True),
        ).all()
    finally:
        db.close()

    base = "https://discover.mentaltech.fr"
    today = date.today().isoformat()
    urls = []
    for p in products_list:
        lastmod = p.updated_at.date().isoformat() if p.updated_at else today
        urls.append(
            f"  <url>\n"
            f"    <loc>{base}/solution/{p.id}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>0.6</priority>\n"
            f"  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>"
    )
    return Response(content=xml, media_type="application/xml")


@app.get("/api/stats/public")
def public_stats():
    from sqlalchemy import func
    from .database import get_db
    from .models.user import User
    from .models.prescription import Prescription
    db = next(get_db())
    try:
        prescriber_count = (
            db.query(func.count(User.id))
            .filter(User.role == "prescriber", User.is_verified_prescriber.is_(True))
            .scalar() or 0
        )
        prescription_count = db.query(func.count(Prescription.id)).scalar() or 0
    finally:
        db.close()
    return {"prescribers": prescriber_count, "prescriptions": prescription_count}
