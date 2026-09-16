import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.schemas.recommendation import (
    ActionableRecommendationResponse,
    RecommendationCategoryType,
    RecommendationStatusType,
    RecommendationPriorityType
)


def synthesize_recommendations(
    farm_id: str,
    farm_name: str,
    crop: str,
    soil_moisture: float,
    disease_condition: Optional[str] = None,
    disease_status: Optional[str] = None,
    rain_probability: float = 30.0
) -> List[ActionableRecommendationResponse]:
    """
    Multi-Signal Decision Engine:
    Combines Disease Scans + Moisture Telemetry + Weather Forecast into Prioritized Farm Action Items.
    """
    recommendations: List[ActionableRecommendationResponse] = []
    now_str = datetime.now(timezone.utc).isoformat()

    # 1. Pathology signals
    if disease_status in ["Needs Attention", "Critical"]:
        recommendations.append(
            ActionableRecommendationResponse(
                id=f"rec-{uuid.uuid4().hex[:6]}",
                category="Disease",
                status="Urgent",
                priority="High",
                title=f"Inspect {crop} Foliage for {disease_condition or 'Pathology'}",
                description=f"Pathogen symptoms ({disease_condition or 'Disease'}) detected during recent scan. Inspect surrounding rows and prune infected foliage.",
                actionText="View Diagnostic Breakdown",
                actionLink=f"/app/history",
                farmId=farm_id,
                farmName=farm_name,
                crop=crop,
                createdAt=now_str
            )
        )

    # 2. Irrigation signals
    if soil_moisture < 35.0:
        priority: RecommendationPriorityType = "High" if soil_moisture < 28.0 else "Medium"
        status: RecommendationStatusType = "Today"
        recommendations.append(
            ActionableRecommendationResponse(
                id=f"rec-{uuid.uuid4().hex[:6]}",
                category="Irrigation",
                status=status,
                priority=priority,
                title=f"Calibrate Drip Irrigation for {farm_name}",
                description=f"Soil moisture has dropped to {soil_moisture}% (below optimal threshold). A scheduled early morning cycle is recommended.",
                actionText="Open Irrigation Advisor",
                actionLink=f"/app/irrigation",
                farmId=farm_id,
                farmName=farm_name,
                crop=crop,
                createdAt=now_str
            )
        )
    elif soil_moisture > 65.0:
        recommendations.append(
            ActionableRecommendationResponse(
                id=f"rec-{uuid.uuid4().hex[:6]}",
                category="Irrigation",
                status="Monitor",
                priority="Medium",
                title="Pause Irrigation & Check Drainage",
                description=f"High soil moisture ({soil_moisture}%) detected. Prevent waterlogging to safeguard roots from fungal rot.",
                actionText="Check Moisture Sensor",
                actionLink=f"/app/irrigation",
                farmId=farm_id,
                farmName=farm_name,
                crop=crop,
                createdAt=now_str
            )
        )

    # 3. Weather signals
    if rain_probability >= 50.0:
        recommendations.append(
            ActionableRecommendationResponse(
                id=f"rec-{uuid.uuid4().hex[:6]}",
                category="Weather",
                status="Today",
                priority="Medium",
                title=f"Impending Rainfall Expected ({rain_probability}%)",
                description="Heavy showers forecasted. Postpone foliar spraying and fertilizer applications to prevent nutrient leaching.",
                actionText="Open Weather Radar",
                actionLink="/app/weather",
                farmId=farm_id,
                farmName=farm_name,
                crop=crop,
                createdAt=now_str
            )
        )

    # 4. General / Scouting baseline if few items
    if len(recommendations) == 0:
        recommendations.append(
            ActionableRecommendationResponse(
                id=f"rec-{uuid.uuid4().hex[:6]}",
                category="Field Care",
                status="Monitor",
                priority="Low",
                title=f"Routine Canopy Scouting for {farm_name}",
                description=f"Crop condition is optimal. Perform routine weekly leaf inspections and record soil dampness.",
                actionText="Scan Crop Leaf",
                actionLink="/app/scanner",
                farmId=farm_id,
                farmName=farm_name,
                crop=crop,
                createdAt=now_str
            )
        )

    return recommendations
