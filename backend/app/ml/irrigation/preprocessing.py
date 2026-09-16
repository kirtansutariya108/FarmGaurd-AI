import numpy as np
from typing import Dict, Any, List

CROP_ENCODING = {
    "Tomato": 0,
    "Potato": 1,
    "Pepper": 2,
    "Bell Pepper": 2,
    "Wheat": 3,
    "Rice": 4,
    "Cotton": 5,
    "Other": 6
}

STAGE_ENCODING = {
    "Seedling": 0,
    "Vegetative": 1,
    "Flowering": 2,
    "Fruiting": 3,
    "Maturity": 4
}


def extract_features(
    crop: str,
    growth_stage: str,
    soil_moisture: float,
    temperature: float,
    humidity: float,
    rain_probability: float,
    last_irrigation_days_ago: int
) -> np.ndarray:
    """Transform farm signals into feature vector for ML model."""
    crop_code = CROP_ENCODING.get(crop, 6)
    stage_code = STAGE_ENCODING.get(growth_stage, 2)
    
    features = np.array([
        [
            crop_code,
            stage_code,
            float(soil_moisture),
            float(temperature),
            float(humidity),
            float(rain_probability),
            float(last_irrigation_days_ago)
        ]
    ], dtype=np.float32)
    
    return features
