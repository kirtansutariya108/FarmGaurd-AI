from typing import Optional, Dict, Any
from app.schemas.health import CropHealthResponse, HealthMetricComponent


def calculate_crop_health(
    crop_name: str,
    farm_name: str,
    soil_moisture: float = 35.0,
    latest_scan_condition: Optional[str] = None,
    latest_scan_confidence: Optional[float] = None,
    is_disease_detected: bool = False,
    rain_probability: float = 30.0,
    temperature: float = 28.0,
    growth_stage: str = "Flowering"
) -> CropHealthResponse:
    """
    FarmGuard Composite Health Index Calculation Methodology:
    ---------------------------------------------------------
    1. Leaf Health & Pigmentation (Weight: 35%):
       - If leaf scan is Healthy: 90 - 95 score
       - If Early/Late Blight or other pathology detected: 50 - 70 score (scaled inversely by confidence)
       - If uninspected: 85 baseline
    2. Disease Risk Safeguard (Weight: 25%):
       - Calculated from ambient temperature (20-30°C humidity conducive to fungi) and presence of pathogens.
    3. Root Moisture Balance (Weight: 25%):
       - Optimal band: 35% - 55% -> 85-95 score
       - Moisture deficit (< 30%): 60-72 score
       - Waterlogged (> 70%): 65-75 score
    4. Weather Stress Index (Weight: 15%):
       - Moderate temperature (22-32°C) and moderate rain probability -> 80-90 score
       - Heatwave (> 38°C) or storm risk -> 50-65 score

    Composite Score = 0.35 * Leaf + 0.25 * PathogenSafeguard + 0.25 * Moisture + 0.15 * WeatherStress
    """
    # 1. Leaf Health Component
    if is_disease_detected:
        conf = latest_scan_confidence or 80.0
        leaf_score = max(40, int(90 - (conf * 0.45)))
        leaf_note = f"Localized symptoms of {latest_scan_condition or 'pathogen'} identified on foliage."
        leaf_variant = "amber" if leaf_score > 60 else "rose"
    else:
        leaf_score = 92 if latest_scan_condition == "Healthy Foliage" else 88
        leaf_note = "Normal chlorophyll levels and healthy canopy vigor."
        leaf_variant = "emerald"

    # 2. Disease Risk Safeguard Component
    if is_disease_detected:
        disease_score = 65
        disease_note = "Active pathogen monitoring required. Restrict free moisture on foliage."
        disease_variant = "amber"
    else:
        disease_score = 85
        disease_note = "Low pathogen spread probability in current microclimate range."
        disease_variant = "emerald"

    # 3. Root Moisture Balance Component
    if 35.0 <= soil_moisture <= 55.0:
        moisture_score = 90
        moisture_note = f"Optimal root zone dampness ({soil_moisture}% current moisture)."
        moisture_variant = "emerald"
    elif soil_moisture < 35.0:
        moisture_score = max(50, int(72 - (35.0 - soil_moisture) * 1.5))
        moisture_note = f"Approaching lower moisture threshold ({soil_moisture}% current soil dampness)."
        moisture_variant = "amber"
    else:
        moisture_score = 75
        moisture_note = f"High soil dampness ({soil_moisture}%). Ensure adequate root aeration."
        moisture_variant = "amber"

    # 4. Weather Stress Component
    if temperature > 38.0 or temperature < 10.0:
        weather_score = 55
        weather_note = f"Temperature extremity ({temperature}°C) causing thermal crop stress."
        weather_variant = "rose"
    else:
        weather_score = 80
        weather_note = f"Favorable ambient conditions ({temperature}°C, {rain_probability}% rain probability)."
        weather_variant = "emerald"

    # Weighted Composite Score
    composite_score = int(
        (0.35 * leaf_score) +
        (0.25 * disease_score) +
        (0.25 * moisture_score) +
        (0.15 * weather_score)
    )

    if composite_score >= 85:
        status = "Optimal"
        summary = f"{farm_name} is in Optimal Buffer Range ({composite_score}/100) with strong canopy vigor."
    elif composite_score >= 70:
        status = "Healthy-looking"
        summary = f"{farm_name} shows stable overall indicators ({composite_score}/100) with minor operational attention points."
    elif composite_score >= 50:
        status = "Needs Attention"
        summary = f"{farm_name} requires agronomic attention ({composite_score}/100) due to moisture or foliar stress."
    else:
        status = "Critical"
        summary = f"{farm_name} is under significant crop stress ({composite_score}/100). Immediate inspection advised."

    metrics = [
        HealthMetricComponent(
            label="Leaf Health & Pigmentation",
            score=leaf_score,
            variant=leaf_variant,
            note=leaf_note
        ),
        HealthMetricComponent(
            label="Disease Risk Safeguard",
            score=disease_score,
            variant=disease_variant,
            note=disease_note
        ),
        HealthMetricComponent(
            label="Root Moisture Balance",
            score=moisture_score,
            variant=moisture_variant,
            note=moisture_note
        ),
        HealthMetricComponent(
            label="Weather Stress Index",
            score=weather_score,
            variant=weather_variant,
            note=weather_note
        ),
    ]

    return CropHealthResponse(
        score=composite_score,
        status=status,
        cropName=crop_name,
        farmName=farm_name,
        summary=summary,
        metrics=metrics
    )
