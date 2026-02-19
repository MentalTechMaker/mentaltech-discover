import logging
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import SQLAlchemyError

from .config import settings
from .routers import auth, products, prescriptions, prescriber, admin

logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(
    title="MentalTech Discover API",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

# Serve uploaded logos as static files (/tmp/uploads est toujours writable)
UPLOADS_DIR = Path("/tmp/uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/api/health")
def health():
    return {"status": "ok"}
