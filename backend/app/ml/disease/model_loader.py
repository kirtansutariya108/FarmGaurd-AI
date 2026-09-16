import os
import json
from typing import Optional, Dict
from app.core.config import settings
from app.core.logging import logger


class DiseaseModelManager:
    _instance: Optional["DiseaseModelManager"] = None
    _model: Optional[object] = None
    _labels: Dict[int, str] = {}
    _is_loaded: bool = False
    _model_version: str = "mobilenetv2-v1.0.0"

    def __new__(cls) -> "DiseaseModelManager":
        if cls._instance is None:
            cls._instance = super(DiseaseModelManager, cls).__new__(cls)
            cls._instance._load_labels()
            cls._instance._load_model()
        return cls._instance

    def _load_labels(self) -> None:
        labels_path = settings.DISEASE_LABELS_PATH
        if os.path.exists(labels_path):
            try:
                with open(labels_path, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                    self._labels = {int(k): v for k, v in raw.items()}
                logger.info(f"Loaded {len(self._labels)} disease classification labels from {labels_path}")
            except Exception as e:
                logger.error(f"Failed to parse labels file {labels_path}: {e}")
                self._labels = {}
        else:
            logger.warning(f"Disease labels file not found at {labels_path}")

    def _load_model(self) -> None:
        model_path = settings.DISEASE_MODEL_PATH
        if os.path.exists(model_path):
            try:
                # Lazy import TensorFlow only if weights exist
                import tensorflow as tf
                self._model = tf.keras.models.load_model(model_path)
                self._is_loaded = True
                logger.info(f"Successfully loaded MobileNetV2 disease model from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load TensorFlow model from {model_path}: {e}")
                self._model = None
                self._is_loaded = False
        else:
            logger.info(f"No custom weights found at {model_path}. Running in {'DEMO' if settings.DEMO_MODE else 'STANDBY'} mode.")
            self._model = None
            self._is_loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    @property
    def labels(self) -> Dict[int, str]:
        return self._labels

    @property
    def model_version(self) -> str:
        return self._model_version

    @property
    def model(self) -> Optional[object]:
        return self._model


disease_model_manager = DiseaseModelManager()
