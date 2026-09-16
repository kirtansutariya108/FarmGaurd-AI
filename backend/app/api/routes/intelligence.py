import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, status

from app.schemas.intelligence import FarmIntelligenceRequest, FarmIntelligenceResponse
from app.schemas.common import ApiResponse
from app.services.weather_service import weather_service, geocode_city_name
from app.services.farm_intelligence_service import farm_intelligence_service

logger = logging.getLogger("farm_intelligence_route")

router = APIRouter(tags=["Farm Intelligence"])


@router.post("/farm-intelligence", response_model=ApiResponse)
async def generate_farm_intelligence(payload: FarmIntelligenceRequest):
    """
    Synthesizes AI disease diagnosis with live hyper-local weather telemetry.
    Reuses existing weather service / geocoding and generates deterministic agronomic recommendations.
    """
    target_lat: Optional[float] = payload.latitude
    target_lng: Optional[float] = payload.longitude
    target_location: Optional[str] = payload.city

    # Geocode city if provided and coordinates are missing
    if (target_lat is None or target_lng is None) and payload.city and payload.city.strip():
        geocoded = await geocode_city_name(payload.city.strip())
        if geocoded:
            target_lat, target_lng, target_location = geocoded
        else:
            logger.info(f"Could not geocode '{payload.city}', using default regional context.")
            target_location = payload.city

    # Fetch weather context (falls back gracefully if weather provider unreachable)
    weather_data = None
    try:
        weather_data = await weather_service.get_current_weather(
            location=target_location or "Vadodara, Gujarat, India",
            lat=target_lat if target_lat is not None else 22.2994,
            lng=target_lng if target_lng is not None else 73.2081
        )
    except Exception as err:
        logger.warning(f"Could not retrieve weather context for intelligence layer: {err}")

    # Generate structured intelligence
    intelligence_data = farm_intelligence_service.generate_advisory(
        disease=payload.disease,
        confidence=payload.confidence,
        weather=weather_data
    )

    return ApiResponse(
        data=intelligence_data.model_dump(),
        message="Farm AI intelligence generated successfully."
    )
