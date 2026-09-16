import io
import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import FastAPI, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
import numpy as np

from app.api.routes.weather import router as weather_router
from app.api.routes.intelligence import router as intelligence_router

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("farm_ai_api")

# Initialize FastAPI application
app = FastAPI(
    title="Farm AI API",
    description="Unified FastAPI backend serving Rice Leaf Disease AI Diagnosis and Live Agricultural Weather Intelligence.",
    version="2.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]
else:
    allowed_origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Weather and Farm Intelligence API Routers
app.include_router(weather_router)
app.include_router(intelligence_router)

# Model configuration
MODEL_PATH = Path(__file__).resolve().parent / "models" / "rice_leaf_disease_model.keras"
METADATA_PATH = Path(__file__).resolve().parent / "models" / "model_config.json"
FALLBACK_METADATA_PATH = Path(__file__).resolve().parent / "models" / "model_metadata.json"

# Configurable confidence threshold (in percentage e.g. 70.0%)
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "70.0"))

class_names = [
    "Bacterial leaf blight",
    "Brown spot",
    "Leaf smut"
]

model = None
model_metadata = {}


def load_model_and_metadata():
    """Loads the trained Keras model and metadata from disk."""
    global model, model_metadata, class_names

    # Load metadata if present
    target_meta = METADATA_PATH if METADATA_PATH.exists() else FALLBACK_METADATA_PATH
    if target_meta.exists():
        try:
            with open(target_meta, "r", encoding="utf-8") as f:
                model_metadata = json.load(f)
                if "classes" in model_metadata:
                    class_names = model_metadata["classes"]
                elif "dataset" in model_metadata and "classes" in model_metadata["dataset"]:
                    class_names = model_metadata["dataset"]["classes"]
            logger.info(f"Loaded model metadata from {target_meta}")
        except Exception as e:
            logger.warning(f"Could not load metadata: {e}")

    if not MODEL_PATH.exists():
        error_msg = f"Model file not found at {MODEL_PATH}."
        logger.error(error_msg)
        raise FileNotFoundError(error_msg)

    if MODEL_PATH.stat().st_size == 0:
        error_msg = f"Model file at {MODEL_PATH} is empty."
        logger.error(error_msg)
        raise ValueError(error_msg)

    try:
        import keras
        model = keras.models.load_model(str(MODEL_PATH))
        logger.info(f"Successfully loaded Keras model from {MODEL_PATH}")
        return model
    except Exception as e:
        logger.error(f"Failed to load Keras model from {MODEL_PATH}: {e}", exc_info=True)
        raise RuntimeError(f"Failed to load model: {str(e)}")


# Startup load
try:
    load_model_and_metadata()
except Exception as exc:
    logger.warning(f"Startup model load deferred or failed: {exc}")


@app.get("/")
def root():
    """Root endpoint providing service, endpoints, and model readiness information."""
    return {
        "status": "ok",
        "service": "Farm AI Agricultural Intelligence API",
        "model_loaded": model is not None,
        "classes": class_names,
        "confidence_threshold_pct": CONFIDENCE_THRESHOLD,
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "weather": "/weather",
            "farm_intelligence": "/farm-intelligence",
            "docs": "/docs"
        },
        "evaluation_metrics": model_metadata.get("experimental_metrics") or model_metadata.get("metrics")
    }


@app.get("/health")
def health_check():
    """Health check endpoint to verify backend status, model readiness, and services."""
    metrics = model_metadata.get("experimental_metrics") or model_metadata.get("metrics") or {}
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH) if MODEL_PATH.exists() else None,
        "classes": class_names,
        "confidence_threshold_pct": CONFIDENCE_THRESHOLD,
        "metrics_summary": {
            "test_accuracy_pct": metrics.get("test_accuracy_pct"),
            "macro_f1_pct": metrics.get("macro_f1_pct") or metrics.get("f1_macro_pct")
        } if metrics else None
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded rice leaf image (multipart/form-data) and returns the AI classification result.
    Applies configurable confidence thresholding (default 70.0%) to prevent false diagnostic certainty.
    """
    global model
    if model is None:
        try:
            model = load_model_and_metadata()
        except Exception as e:
            logger.error(f"Model unavailable during predict request: {e}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={
                    "success": False,
                    "error": f"AI model is currently unavailable: {str(e)}"
                }
            )

    # Validate file existence
    if not file or not file.filename:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "error": "No file uploaded. Please upload a rice leaf image using the 'file' field."
            }
        )

    try:
        image_bytes = await file.read()
        if not image_bytes:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "error": "Uploaded image file is empty."
                }
            )

        # Open and process image using Pillow
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Verify integrity
            # Reopen after verify
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except (UnidentifiedImageError, OSError, ValueError) as img_err:
            logger.warning(f"Invalid image received ({file.filename}): {img_err}")
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "error": "Invalid or corrupted image file. Please upload a valid JPG, PNG, or WEBP image."
                }
            )

        # Resize to model required input size: 224 x 224
        image = image.resize((224, 224))

        # Convert to NumPy float32 array normalized to [0, 1]
        image_array = np.array(image, dtype=np.float32) / 255.0

        # Add batch dimension: (1, 224, 224, 3)
        image_array = np.expand_dims(image_array, axis=0)

        # Execute model prediction
        predictions = model.predict(image_array, verbose=0)
        
        if predictions is None or len(predictions) == 0:
            raise ValueError("Model returned empty predictions.")

        prediction_row = predictions[0]
        predicted_index = int(np.argmax(prediction_row))
        predicted_class = class_names[predicted_index]
        confidence = float(prediction_row[predicted_index] * 100)

        probabilities: Dict[str, float] = {
            class_names[i]: round(float(prediction_row[i] * 100), 2)
            for i in range(min(len(class_names), len(prediction_row)))
        }

        logger.info(f"Inference: {predicted_class} ({confidence:.2f}%) for '{file.filename}'")

        # Check against confidence threshold
        is_confident = confidence >= CONFIDENCE_THRESHOLD

        if is_confident:
            return {
                "success": True,
                "status": "prediction",
                "disease": predicted_class,
                "confidence": round(confidence, 2),
                "threshold_pct": CONFIDENCE_THRESHOLD,
                "explanation": f"The uploaded image has visual patterns that the model associates with {predicted_class}.",
                "probabilities": probabilities
            }
        else:
            return {
                "success": True,
                "status": "uncertain",
                "disease": None,
                "suggested_condition": predicted_class,
                "confidence": round(confidence, 2),
                "threshold_pct": CONFIDENCE_THRESHOLD,
                "message": f"Unable to confidently identify the disease. Model confidence ({confidence:.1f}%) is below the {CONFIDENCE_THRESHOLD:.0f}% threshold. Please upload a clear, well-lit photo of the affected rice leaf.",
                "explanation": "The image features are inconclusive or ambiguous across multiple disease categories.",
                "probabilities": probabilities
            }

    except Exception as exc:
        logger.error(f"Inference error processing '{file.filename}': {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": f"Prediction failed due to an internal server error: {str(exc)}"
            }
        )