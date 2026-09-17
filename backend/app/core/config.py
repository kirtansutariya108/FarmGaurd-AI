import os
from typing import List, Union, Any
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "FarmGuard AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    API_PREFIX: str = "/api"

    # Demo mode allows safe fallbacks when ML weights or external APIs are unavailable
    DEMO_MODE: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./farmguard.db"

    # JWT Authentication
    JWT_SECRET_KEY: str = "super-secret-key-change-in-production-min-32-chars-long"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    import json
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

    # ML Inference
    DISEASE_MODEL_PATH: str = "./models/rice_leaf_disease_model.keras"
    DISEASE_LABELS_PATH: str = "./app/ml/disease/labels.json"
    DISEASE_CONFIDENCE_THRESHOLD: float = 0.60
    IRRIGATION_MODEL_PATH: str = "./models/irrigation_model.joblib"

    # Weather
    WEATHER_PROVIDER: str = "open-meteo"
    WEATHER_API_KEY: str = ""
    WEATHER_API_BASE_URL: str = "https://api.open-meteo.com/v1"

    # Storage
    STORAGE_TYPE: str = "local"  # "local" or "supabase"
    STORAGE_DIR: str = "./uploads"
    STORAGE_BUCKET: str = "crop-scans"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
