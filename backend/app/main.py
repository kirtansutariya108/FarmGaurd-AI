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


# 5. Include API Routers (both with /api prefix and direct root for frontend convenience)
# 5. Include API Routers
app.include_router(api_router, prefix=settings.API_PREFIX)
app.include_router(api_router)


# 6. ML Plant Disease Prediction Endpoint with Crop Gating
import io
from typing import Optional
from PIL import Image
from fastapi import File, Form, UploadFile, HTTPException
from app.services.disease_model import disease_model_service
from app.services.crop_gate import crop_gate_service
from app.schemas.disease import PredictResponse

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@app.post(
    "/api/predict",
    response_model=PredictResponse,
    summary="Predict Plant Disease with Crop Gating",
    tags=["Plant Disease Prediction"]
)
@app.post(
    "/predict",
    response_model=PredictResponse,
    include_in_schema=False
)
async def predict_plant_disease(
    file: UploadFile = File(...),
    crop: Optional[str] = Form(None),
    selected_crop: Optional[str] = Form(None)
):
    """
    Independent pre-diagnostic crop gating layer followed by crop-specific disease diagnosis.
    1. Pre-diagnosis Crop Validation Gate:
       Validates uploaded leaf image against selected crop (Rice, Tomato, Potato) or Other/Unknown.
       Blocks execution immediately on crop mismatch, low confidence, or non-leaf input.
    2. Disease Inference:
       Runs ONLY when image matches selected crop with confidence >= 70%.
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded. Please upload a leaf image."
        )

    # Validate file format
    filename_lower = file.filename.lower()
    content_type_valid = file.content_type in ALLOWED_CONTENT_TYPES if file.content_type else False
    extension_valid = any(filename_lower.endswith(ext) for ext in ALLOWED_EXTENSIONS)

    if not content_type_valid and not extension_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid leaf image (JPG, JPEG, PNG, or WEBP)."
        )

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded image file is empty."
            )

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as img_err:
            logger.warning(f"Invalid image uploaded: {img_err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or corrupted image file. Please upload a valid JPG, PNG, or WEBP image."
            )

        # STAGE 1 & 2: Crop Validation Gate
        chosen_crop = selected_crop or crop or "Rice"
        gate_result = crop_gate_service.validate_crop(
            image,
            selected_crop=chosen_crop,
            filename_hint=file.filename
        )

        # STAGE 3: Strict Gating Check - Block execution if mismatched or non-leaf
        if not gate_result.prediction_allowed:
            return PredictResponse(
                success=False,
                status="crop_mismatch" if gate_result.error_code == "CROP_MISMATCH" else "unsupported_image",
                selectedCrop=gate_result.selected_crop,
                detectedCrop=gate_result.detected_crop,
                cropConfidence=gate_result.crop_confidence,
                cropMatch=gate_result.crop_match,
                predictionAllowed=False,
                errorCode=gate_result.error_code,
                crop=gate_result.detected_crop,
                confidence=gate_result.crop_confidence,
                message=gate_result.message,
            )

        # STAGE 4: Disease Model Diagnosis (ONLY runs for validated, compatible crop)
        prediction = disease_model_service.predict(image, crop=gate_result.selected_crop)
        return PredictResponse(
            success=True,
            status=prediction.get("status", "success"),
            selectedCrop=gate_result.selected_crop,
            detectedCrop=gate_result.detected_crop,
            cropConfidence=gate_result.crop_confidence,
            cropMatch=True,
            predictionAllowed=True,
            errorCode=None,
            crop=prediction.get("crop", gate_result.selected_crop),
            disease=prediction.get("disease"),
            class_name=prediction.get("class_name"),
            confidence=prediction.get("confidence", 0.0),
            message=prediction.get("message"),
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Inference error during leaf diagnosis: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during disease diagnosis prediction."
        )


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": f"{settings.API_PREFIX}/health",
        "status": "online"
    }

