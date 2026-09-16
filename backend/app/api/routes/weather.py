from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from app.schemas.weather import WeatherDataResponse
from app.schemas.common import ApiResponse
from app.services.weather_service import weather_service, geocode_city_name

router = APIRouter(tags=["Weather"])


@router.get("/weather", response_model=ApiResponse[WeatherDataResponse])
async def get_live_weather(
    latitude: Optional[float] = Query(None, description="Latitude between -90 and 90"),
    longitude: Optional[float] = Query(None, description="Longitude between -180 and 180"),
    city: Optional[str] = Query(None, description="City or village name e.g. Vadodara, Surat")
):
    """
    Public live agro-meteorological endpoint.
    Accepts either latitude + longitude OR city name to fetch live Open-Meteo telemetry & 7-day forecast.
    """
    target_lat: Optional[float] = None
    target_lng: Optional[float] = None
    target_location: Optional[str] = None

    # 1. Coordinates provided
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

    # 2. City query provided without coordinates
    elif city and city.strip():
        geocoded = await geocode_city_name(city.strip())
        if not geocoded:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Location '{city}' could not be resolved. Please verify spelling or provide coordinates."
            )
        target_lat, target_lng, target_location = geocoded

    # 3. Neither provided
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing location parameters. You must provide either 'city' (e.g. ?city=Vadodara) or both 'latitude' and 'longitude' (e.g. ?latitude=22.3072&longitude=73.1812)."
        )

    weather_data = await weather_service.get_current_weather(
        location=target_location,
        lat=target_lat,
        lng=target_lng
    )

    return ApiResponse(
        data=weather_data,
        message="Live weather fetched successfully."
    )
