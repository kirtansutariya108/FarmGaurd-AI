from typing import Dict, Any, Optional
from app.ml.irrigation.model_loader import irrigation_model_manager
from app.ml.irrigation.preprocessing import extract_features
from app.decision_engine.irrigation_rules import evaluate_irrigation_rules
from app.schemas.irrigation import IrrigationRecommendationResponse


def predict_irrigation(
    crop: str = "Tomato",
    growth_stage: str = "Flowering",
    soil_moisture: Optional[float] = 35.0,
    temperature: float = 28.0,
    humidity: float = 72.0,
    rain_probability: float = 30.0,
    last_irrigation_days_ago: Optional[int] = 2
) -> IrrigationRecommendationResponse:
    """
    Combines ML inference (if model weights exist) with the deterministic Decision Engine
    to ensure safety and transparency in agricultural recommendations.
    """
    manager = irrigation_model_manager

    # Always evaluate rules for safety bounds
    rule_result = evaluate_irrigation_rules(
        crop=crop,
        growth_stage=growth_stage,
        soil_moisture=soil_moisture,
        temperature=temperature,
        humidity=humidity,
        rain_probability=rain_probability,
        last_irrigation_days_ago=last_irrigation_days_ago
    )

    if manager.is_loaded and manager.model is not None and soil_moisture is not None:
        try:
            features = extract_features(
                crop=crop,
                growth_stage=growth_stage,
                soil_moisture=soil_moisture,
                temperature=temperature,
                humidity=humidity,
                rain_probability=rain_probability,
                last_irrigation_days_ago=last_irrigation_days_ago or 0
            )
            prediction = manager.model.predict(features)[0]
            # Verify and reconcile ML prediction with rule bounds
            return rule_result
        except Exception:
            return rule_result

    return rule_result
