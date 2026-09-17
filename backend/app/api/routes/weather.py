from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.repositories.farm_repository import FarmRepository
from app.schemas.weather import WeatherDataResponse
from app.schemas.common import ApiResponse
from app.services.weather_service import weather_service, geocode_city_name

router = APIRouter(tags=["Weather"])


@router.get("/weather", response_model=ApiResponse[WeatherDataResponse])
@router.get("/weather/current", response_model=ApiResponse[WeatherDataResponse])
@router.get("/weather/forecast", response_model=ApiResponse[WeatherDataResponse])
async def get_live_weather(
    latitude: Optional[float] = Query(None, description="Latitude between -90 and 90"),
    longitude: Optional[float] = Query(None, description="Longitude between -180 and 180"),
    city: Optional[str] = Query(None, description="City or village name e.g. Vadodara, Surat"),
    farm_id: Optional[str] = Query(None, description="Optional farm ID to fetch weather for"),
    db: Session = Depends(get_db)
):
    """
    Public live agro-meteorological endpoint.
    Accepts latitude + longitude, city name, or farm_id to fetch live Open-Meteo telemetry & 7-day forecast.
    """
    target_lat: Optional[float] = None
    target_lng: Optional[float] = None
    target_location: Optional[str] = None

    # 1. If farm_id is provided, try resolving from farm record
    if farm_id:
        farm = FarmRepository(db).get_by_id(farm_id)
        if farm:
            if farm.latitude is not None and farm.longitude is not None:
                target_lat = farm.latitude
                target_lng = farm.longitude
                target_location = farm.location or farm.name
            elif farm.location:
                city = farm.location.split(",")[0].strip()

    # 2. Coordinates provided
    if latitude is not None and longitude is not None:
        if not (-90.0 <= latitude <= 90.0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid latitude {latitude}. Latitude must be between -90 and 90."
            )
        if not (-180.0 <= longitude <= 180.0):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid longitude {longitude}. Longitude must be between -180 and 180."
            )
        target_lat = latitude
        target_lng = longitude
        target_location = city or f"Coordinates ({latitude:.4f}, {longitude:.4f})"

    elif (latitude is not None and longitude is None) or (latitude is None and longitude is not None):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both latitude and longitude must be provided together."
        )

    # 3. City query provided
    elif city and city.strip():
        geocoded = await geocode_city_name(city.strip())
        if geocoded:
            target_lat, target_lng, target_location = geocoded
        else:
            # Fallback to provided city name directly with default coords
            target_location = city.strip()
            target_lat = 22.3072
            target_lng = 73.1812

    # 4. Default fallback if nothing specified
    if target_location is None and target_lat is None:
        target_location = "Vadodara, Gujarat, India"
        target_lat = 22.3072
        target_lng = 73.1812

    weather_data = await weather_service.get_current_weather(
        location=target_location,
        lat=target_lat,
        lng=target_lng
    )

    return ApiResponse(
        data=weather_data,
        message="Live weather fetched successfully."
    )
