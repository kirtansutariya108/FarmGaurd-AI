import os
from typing import Optional
from app.core.config import settings
from app.core.logging import logger


class IrrigationModelManager:
    _instance: Optional["IrrigationModelManager"] = None
    _model: Optional[object] = None
    _is_loaded: bool = False
    _model_version: str = "randomforest-v1.0.0"

    def __new__(cls) -> "IrrigationModelManager":
        if cls._instance is None:
            cls._instance = super(IrrigationModelManager, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self) -> None:
        model_path = settings.IRRIGATION_MODEL_PATH
        if os.path.exists(model_path):
            try:
                import joblib
                self._model = joblib.load(model_path)
                self._is_loaded = True
                logger.info(f"Loaded Scikit-Learn irrigation model from {model_path}")
            except Exception as e:
                logger.error(f"Failed to load irrigation model from {model_path}: {e}")
                self._model = None
                self._is_loaded = False
        else:
            logger.info(f"No custom irrigation model at {model_path}. Decision Engine will handle recommendations.")
            self._model = None
            self._is_loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    @property
    def model(self) -> Optional[object]:
        return self._model

    @property
    def model_version(self) -> str:
        return self._model_version


irrigation_model_manager = IrrigationModelManager()
