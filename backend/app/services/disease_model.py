import json
import logging
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import tensorflow as tf
from PIL import Image

logger = logging.getLogger("plant_disease_model")

# --------------------------------------------------
# Paths & Constants
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "plant_disease_model.keras"
CLASS_NAMES_PATH = BASE_DIR / "class_names.json"

EXPECTED_NUM_CLASSES = 16
CONFIDENCE_THRESHOLD = 0.60


class PlantDiseaseModelService:
    """Thread-safe singleton service for loading and running the 16-class Plant Disease AI model."""

    _instance: Optional["PlantDiseaseModelService"] = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls) -> "PlantDiseaseModelService":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(PlantDiseaseModelService, cls).__new__(cls)
                    cls._instance._model = None
                    cls._instance._class_names = None
        return cls._instance

    def load_class_names(self) -> List[str]:
        """Load and validate the authoritative 16-class list from class_names.json."""
        if self._class_names is not None:
            return self._class_names

        if not CLASS_NAMES_PATH.exists():
            raise FileNotFoundError(f"Class names file not found at: {CLASS_NAMES_PATH}")

        try:
            with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            raise ValueError(f"Failed to parse class names JSON at {CLASS_NAMES_PATH}: {e}") from e

        if not isinstance(data, list):
            raise ValueError(f"class_names.json must contain a JSON array, got {type(data).__name__}")

        if len(data) != EXPECTED_NUM_CLASSES:
            raise ValueError(
                f"Expected exactly {EXPECTED_NUM_CLASSES} classes, but found {len(data)} classes in {CLASS_NAMES_PATH}"
            )

        self._class_names = data
        logger.info(f"✅ Loaded {len(self._class_names)} disease classes from {CLASS_NAMES_PATH}")
        return self._class_names

    def load_model(self) -> tf.keras.Model:
        """Load the trained MobileNetV2 Keras model only once."""
        if self._model is not None:
            return self._model

        with self._lock:
            if self._model is not None:
                return self._model

            if not MODEL_PATH.exists():
                raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")

            logger.info(f"Loading Plant Disease AI model from: {MODEL_PATH}...")
            try:
                loaded_model = tf.keras.models.load_model(str(MODEL_PATH))
            except Exception as e:
                logger.error(f"Failed to load Keras model from {MODEL_PATH}: {e}")
                raise RuntimeError(f"Could not load TensorFlow model: {e}") from e

            # Verify model output matches class count
            output_shape = loaded_model.output_shape
            num_outputs = output_shape[-1]
            if num_outputs != EXPECTED_NUM_CLASSES:
                raise ValueError(
                    f"Model output dimension ({num_outputs}) does not match expected {EXPECTED_NUM_CLASSES} classes"
                )

            self._model = loaded_model
            logger.info(f"✅ Plant Disease AI model loaded successfully! Output dimension: {num_outputs}")
            return self._model

    def predict(self, image: Image.Image) -> Dict[str, Any]:
        """
        Run inference on a PIL image using the 16-class Plant Disease model.
        Pipeline: PIL Image -> RGB -> 224x224 -> float32 array -> batch dimension -> model.predict()
        """
        if not isinstance(image, Image.Image):
            raise TypeError("Input must be a valid PIL.Image.Image instance")

        classes = self.load_class_names()
        model = self.load_model()

        # 1. Convert to RGB
        rgb_image = image.convert("RGB")

        # 2. Resize to model input shape (224, 224)
        resized_image = rgb_image.resize((224, 224))

        # 3. Convert to NumPy array float32 (MobileNetV2 architecture handles internal rescaling)
        image_array = np.array(resized_image, dtype=np.float32)

        # 3b. Objective check for blank / solid-color non-leaf images (standard deviation < 8.0 across 0-255 scale)
        pixel_std = float(np.std(image_array))
        if pixel_std < 8.0:
            return {
                "success": False,
                "status": "unsupported_image",
                "crop": None,
                "disease": None,
                "class_name": None,
                "confidence": 0.0,
                "message": "The uploaded image appears blank or lacks visual leaf features. Please upload a clear photo of a Tomato or Rice leaf."
            }

        # 4. Add batch dimension -> (1, 224, 224, 3)
        image_batch = np.expand_dims(image_array, axis=0)

        # 5. Run prediction
        predictions = model.predict(image_batch, verbose=0)[0]

        # 6. Extract argmax class and confidence
        predicted_index = int(np.argmax(predictions))
        confidence = float(predictions[predicted_index])
        predicted_class = classes[predicted_index]

        # 7. Crop identification logic
        if predicted_class.startswith("rice_"):
            crop = "Rice"
        else:
            crop = "Tomato"

        # 8. Confidence threshold evaluation (0.60)
        if confidence >= CONFIDENCE_THRESHOLD:
            return {
                "success": True,
                "status": "success",
                "crop": crop,
                "disease": predicted_class,
                "class_name": predicted_class,
                "confidence": round(confidence, 4),
            }
        else:
            return {
                "success": True,
                "status": "low_confidence",
                "crop": crop,
                "disease": predicted_class,
                "class_name": predicted_class,
                "confidence": round(confidence, 4),
                "message": "The image could not be classified confidently. Please upload a clearer Tomato or Rice leaf image.",
            }


# Service instance & top-level compatibility interface
disease_model_service = PlantDiseaseModelService()


def predict_image(image: Image.Image) -> Dict[str, Any]:
    """Compatibility wrapper function matching standard caller signature."""
    return disease_model_service.predict(image)