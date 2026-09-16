import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import logger
from app.core.middleware import RequestContextMiddleware
from app.core.exceptions import FarmGuardException
from app.api.routes import api_router
from app.db.database import engine, SessionLocal
from app.db.models import Base
from app.db.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing FarmGuard AI Backend Services...")
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    os.makedirs("./models", exist_ok=True)

    # Auto-initialize database tables in dev/demo mode
    Base.metadata.create_all(bind=engine)
    if settings.DEMO_MODE:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()

    logger.info(f"FarmGuard AI Backend is active in [{settings.APP_ENV}] mode on port {settings.PORT}")
    yield
    # Shutdown
    logger.info("Shutting down FarmGuard AI Backend...")


app = FastAPI(
    title="FarmGuard AI API",
    description="""
# FarmGuard AI - Agricultural Decision Support Backend API
Comprehensive decision-support API powering crop disease leaf diagnosis, smart irrigation scheduling, weather insights, composite crop health scoring, and actionable recommendations.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# 1. Custom Logging & Correlation ID Middleware
app.add_middleware(RequestContextMiddleware)

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Mount Static Uploads
if os.path.exists(settings.STORAGE_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.STORAGE_DIR), name="uploads")


# 4. Centralized Exception Handlers
@app.exception_handler(FarmGuardException)
async def farmguard_exception_handler(request: Request, exc: FarmGuardException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    clean_errors = [
        {"field": ".".join([str(loc) for loc in e.get("loc", [])]), "message": e.get("msg")}
        for e in errors
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "The submitted data is invalid or missing required fields.",
                "details": clean_errors
            }
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled internal server error: {exc}", exc_info=True)
    message = "An internal server error occurred." if not settings.DEBUG else str(exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": message
            }
        }
    )


# 5. Include API Routers
app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
        "status": "online"
    }
