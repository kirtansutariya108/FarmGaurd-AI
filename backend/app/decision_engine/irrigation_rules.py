from typing import Optional, List
from app.schemas.irrigation import (
    IrrigationRecommendationResponse,
    FieldSignals,
    IrrigationStatusType,
    PriorityType
)


def evaluate_irrigation_rules(
    crop: str = "Tomato",
    growth_stage: str = "Flowering",
    soil_moisture: Optional[float] = 35.0,
    temperature: float = 28.0,
    humidity: float = 72.0,
    rain_probability: float = 30.0,
    last_irrigation_days_ago: Optional[int] = 2
) -> IrrigationRecommendationResponse:
    """
    Transparent Agro-Meteorological Decision Engine for Irrigation Support:
    Evaluates root-zone moisture, crop phenological stage, and atmospheric demand.
    """
    if soil_moisture is None:
        return IrrigationRecommendationResponse(
            status="Insufficient Data",
            priority="Low",
            headline="Moisture Telemetry Missing",
            summary="No soil moisture sensor data recorded for this parcel. Log field readings to evaluate.",
            reasons=[
                "Moisture readings not updated for parcel.",
                "Weather telemetry alone cannot determine root zone tension."
            ],
            actionAdvice="Record soil moisture or manual probe observation before scheduling irrigation.",
            fieldSignals=FieldSignals(
                crop=crop,
                growthStage=growth_stage,
                soilMoisture=None,
                temperature=temperature,
                humidity=humidity,
                rainProbability=rain_probability,
                lastIrrigationDaysAgo=last_irrigation_days_ago
            )
        )

    reasons: List[str] = []
    
    # 1. Evaluate rain probability forecast
    high_rain_expected = rain_probability >= 60.0

    # 2. Evaluate moisture thresholds
    if soil_moisture < 35.0:
        if high_rain_expected:
            status: IrrigationStatusType = "Monitor"
            priority: PriorityType = "Medium"
            headline = "Monitor Upcoming Rain Before Irrigating"
            summary = f"Soil moisture is low ({soil_moisture}%), but a high probability of rain ({rain_probability}%) is forecasted."
            reasons.append(f"Soil moisture ({soil_moisture}%) is approaching lower threshold.")
            reasons.append(f"Forecast indicates {rain_probability}% precipitation likelihood.")
            action_advice = "Hold off on scheduled cycle for 12-24 hours to utilize natural precipitation."
        else:
            status = "Recommended"
            priority = "High"
            headline = "Consider Irrigation Soon"
            summary = f"Soil moisture is at {soil_moisture}%, which is below optimal levels for {growth_stage} stage."
            reasons.append(f"Soil moisture ({soil_moisture}%) has dropped below the 35% threshold.")
            if last_irrigation_days_ago is not None:
                reasons.append(f"Last irrigation logged {last_irrigation_days_ago} days ago.")
            if growth_stage in ["Flowering", "Fruiting"]:
                reasons.append(f"Crop is in moisture-sensitive {growth_stage} stage.")
            action_advice = "Schedule irrigation during cooler morning hours to minimize evaporative losses."
    elif soil_moisture >= 45.0:
        status = "Not Needed"
        priority = "Low"
        headline = "Adequate Moisture Available"
        summary = f"Soil moisture is healthy at {soil_moisture}%. No irrigation is required for the next 24-48 hours."
        reasons.append(f"Root zone dampness ({soil_moisture}%) is within optimal upper buffer.")
        reasons.append("Atmospheric transpiration rate is within normal crop tolerance.")
        action_advice = "Maintain routine moisture monitoring and avoid waterlogging."
    else:
        # 35.0 to 44.9%
        status = "Monitor"
        priority = "Medium"
        headline = "Moisture Conditions Stable"
        summary = f"Soil moisture is at {soil_moisture}%. Soil dampness is moderate."
        reasons.append(f"Soil moisture ({soil_moisture}%) is in stable intermediate range.")
        reasons.append(f"Atmospheric humidity is at {humidity}%.")
        action_advice = "Inspect field conditions again in 24 hours before next cycle."

    return IrrigationRecommendationResponse(
        status=status,
        priority=priority,
        headline=headline,
        summary=summary,
        reasons=reasons,
        actionAdvice=action_advice,
        fieldSignals=FieldSignals(
            crop=crop,
            growthStage=growth_stage,
            soilMoisture=soil_moisture,
            temperature=temperature,
            humidity=humidity,
            rainProbability=rain_probability,
            lastIrrigationDaysAgo=last_irrigation_days_ago
        )
    )
