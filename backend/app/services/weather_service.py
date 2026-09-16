import datetime
import httpx
from typing import Optional, List, Dict, Any, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.schemas.weather import WeatherDataResponse, ForecastDay

# WMO Weather interpretation code (WW) mapping to human condition and icon
WMO_WEATHER_CODES: Dict[int, Tuple[str, str]] = {
    0: ("Clear Sky", "sun"),
    1: ("Mainly Clear", "cloud-sun"),
    2: ("Partly Cloudy", "cloud-sun"),
    3: ("Overcast", "cloud"),
    45: ("Fog", "cloud-fog"),
    48: ("Depositing Rime Fog", "cloud-fog"),
    51: ("Light Drizzle", "cloud-drizzle"),
    53: ("Moderate Drizzle", "cloud-drizzle"),
    55: ("Dense Drizzle", "cloud-drizzle"),
    56: ("Light Freezing Drizzle", "cloud-drizzle"),
    57: ("Dense Freezing Drizzle", "cloud-drizzle"),
    61: ("Slight Rain", "cloud-rain"),
    63: ("Moderate Rain", "cloud-rain"),
    65: ("Heavy Rain", "cloud-rain"),
    66: ("Light Freezing Rain", "cloud-rain"),
    67: ("Heavy Freezing Rain", "cloud-rain"),
    71: ("Slight Snow", "snowflake"),
    73: ("Moderate Snow", "snowflake"),
    75: ("Heavy Snow", "snowflake"),
    77: ("Snow Grains", "snowflake"),
    80: ("Slight Rain Showers", "cloud-rain"),
    81: ("Moderate Rain Showers", "cloud-rain"),
    82: ("Violent Rain Showers", "cloud-rain"),
    85: ("Slight Snow Showers", "snowflake"),
    86: ("Heavy Snow Showers", "snowflake"),
    95: ("Thunderstorm", "cloud-lightning"),
    96: ("Thunderstorm with Slight Hail", "cloud-lightning"),
    99: ("Thunderstorm with Heavy Hail", "cloud-lightning"),
}


def parse_wmo_code(code: Optional[int]) -> Tuple[str, str]:
    """Return condition text and icon string for a given WMO weather code."""
    if code is None:
        return "Partly Cloudy", "cloud-sun"
    return WMO_WEATHER_CODES.get(int(code), ("Partly Cloudy", "cloud-sun"))


async def geocode_city_name(city: str) -> Optional[Tuple[float, float, str]]:
    """
    Search Open-Meteo Geocoding API for city/village.
    Returns (latitude, longitude, formatted_location_string) or None if not found.
    """
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city.strip()}&count=1&language=en&format=json"
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(url)
            if res.status_code == 200:
                data = res.json()
                results = data.get("results")
                if results and len(results) > 0:
                    top = results[0]
                    lat = float(top["latitude"])
                    lng = float(top["longitude"])
                    name = top.get("name", city)
                    admin1 = top.get("admin1")
                    country = top.get("country")
                    parts = [p for p in [name, admin1, country] if p]
                    formatted_name = ", ".join(parts)
                    return lat, lng, formatted_name
    except Exception as e:
        logger.warning(f"Open-Meteo geocoding request failed for '{city}': {e}")
    return None


class WeatherProvider:
    async def get_weather(
        self,
        location: str,
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> WeatherDataResponse:
        raise NotImplementedError


class MockWeatherProvider(WeatherProvider):
    async def get_weather(
        self,
        location: str,
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> WeatherDataResponse:
        day_names = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"]
        today = datetime.date.today()

        forecast = [
            ForecastDay(
                date=(today + datetime.timedelta(days=i)).isoformat(),
                dayName=day_names[i] if i < len(day_names) else f"Day {i+1}",
                tempMax=31.0 + (i % 3),
                tempMin=22.0 + (i % 2),
                condition="Partly Cloudy" if i % 2 == 0 else "Scattered Showers",
                rainProbability=30.0 + (i * 5),
                humidity=70.0 + (i * 2),
                icon="cloud-sun" if i % 2 == 0 else "cloud-rain",
                precipitationMm=0.0 if i % 2 == 0 else 2.5,
                uvIndex=6.0
            )
            for i in range(7)
        ]

        return WeatherDataResponse(
            location=location or "Vadodara, Gujarat, India",
            latitude=lat or 22.3072,
            longitude=lng or 73.1812,
            currentTemp=28.0,
            condition="Partly Cloudy",
            humidity=72.0,
            rainProbability=30.0,
            windSpeedKmH=14.0,
            uvIndex=6.0,
            soilTemp=24.0,
            precipitationMm=0.0,
            forecast=forecast,
            farmInsight="Simulated fallback telemetry. Open-Meteo service was unreachable; please verify internet connectivity.",
            lastUpdated="Just now",
            source="fallback"
        )


class OpenMeteoWeatherProvider(WeatherProvider):
    async def get_weather(
        self,
        location: str,
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> WeatherDataResponse:
        latitude = lat if lat is not None else 22.3072
        longitude = lng if lng is not None else 73.1812

        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={latitude}&longitude={longitude}"
            f"&current=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,weather_code,soil_temperature_0cm"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean,uv_index_max,weather_code"
            f"&timezone=auto"
        )

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    daily = data.get("daily", {})

                    # Extract current weather variables
                    curr_temp = float(current.get("temperature_2m", 28.0))
                    curr_humidity = float(current.get("relative_humidity_2m", 70.0))
                    curr_rain_prob = float(current.get("precipitation_probability", 0.0) or 0.0)
                    curr_wind = float(current.get("wind_speed_10m", 10.0))
                    curr_precip_mm = float(current.get("precipitation", 0.0) or 0.0)
                    curr_soil_temp = float(current.get("soil_temperature_0cm", curr_temp - 2.0))
                    curr_code = current.get("weather_code", 0)
                    curr_condition, _ = parse_wmo_code(curr_code)

                    # Extract 7-day daily forecast variables
                    dates = daily.get("time", [])
                    t_max = daily.get("temperature_2m_max", [])
                    t_min = daily.get("temperature_2m_min", [])
                    p_sum = daily.get("precipitation_sum", [])
                    p_prob = daily.get("precipitation_probability_max", [])
                    hum = daily.get("relative_humidity_2m_mean", [])
                    uv_max = daily.get("uv_index_max", [])
                    codes = daily.get("weather_code", [])

                    forecast_days: List[ForecastDay] = []
                    day_names_abbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

                    num_days = min(7, len(dates))
                    for i in range(num_days):
                        d_str = dates[i]
                        try:
                            parsed_date = datetime.date.fromisoformat(d_str)
                            weekday_name = day_names_abbr[parsed_date.weekday()]
                        except Exception:
                            weekday_name = f"Day {i+1}"

                        day_label = "Today" if i == 0 else weekday_name
                        code_val = codes[i] if i < len(codes) else 0
                        cond_name, icon_name = parse_wmo_code(code_val)

                        forecast_days.append(
                            ForecastDay(
                                date=d_str,
                                dayName=day_label,
                                tempMax=round(float(t_max[i]), 1) if i < len(t_max) and t_max[i] is not None else 30.0,
                                tempMin=round(float(t_min[i]), 1) if i < len(t_min) and t_min[i] is not None else 22.0,
                                condition=cond_name,
                                rainProbability=round(float(p_prob[i]), 0) if i < len(p_prob) and p_prob[i] is not None else 0.0,
                                humidity=round(float(hum[i]), 0) if i < len(hum) and hum[i] is not None else 65.0,
                                icon=icon_name,
                                precipitationMm=round(float(p_sum[i]), 1) if i < len(p_sum) and p_sum[i] is not None else 0.0,
                                uvIndex=round(float(uv_max[i]), 1) if i < len(uv_max) and uv_max[i] is not None else 5.0
                            )
                        )

                    # Determine today's UV index from daily UV max
                    today_uv = float(uv_max[0]) if uv_max and len(uv_max) > 0 and uv_max[0] is not None else 5.0

                    # Dynamic agricultural farm insight
                    if curr_rain_prob >= 60 or curr_precip_mm > 2.0:
                        insight = f"High precipitation likelihood ({curr_rain_prob:.0f}%). Postpone scheduled irrigation cycles and foliar fungicide spraying."
                    elif curr_rain_prob >= 30:
                        insight = f"Scattered rain possible ({curr_rain_prob:.0f}%). Inspect soil rootzone moisture before initiating field irrigation."
                    elif curr_temp >= 36:
                        insight = f"Elevated temperature ({curr_temp:.1f}°C) with high evapotranspiration demand. Ensure adequate soil hydration."
                    elif curr_humidity >= 85:
                        insight = f"High ambient relative humidity ({curr_humidity:.0f}%). Monitor canopy closely for foliar fungal and bacterial spore proliferation."
                    else:
                        insight = f"Optimal agro-climatic conditions for paddy maintenance. Soil temperature is {curr_soil_temp:.1f}°C."

                    return WeatherDataResponse(
                        location=location,
                        latitude=round(latitude, 4),
                        longitude=round(longitude, 4),
                        currentTemp=round(curr_temp, 1),
                        condition=curr_condition,
                        humidity=round(curr_humidity, 1),
                        rainProbability=round(curr_rain_prob, 0),
                        windSpeedKmH=round(curr_wind, 1),
                        uvIndex=round(today_uv, 1),
                        soilTemp=round(curr_soil_temp, 1),
                        precipitationMm=round(curr_precip_mm, 1),
                        forecast=forecast_days,
                        farmInsight=insight,
                        lastUpdated="Just now",
                        source="open-meteo"
                    )
        except Exception as e:
            logger.warning(f"Open-Meteo live query failed: {e}. Returning fallback telemetry.")

        return await MockWeatherProvider().get_weather(location, lat, lng)


class WeatherService:
    def __init__(self):
        self.live_provider: WeatherProvider = OpenMeteoWeatherProvider()
        self.mock_provider: WeatherProvider = MockWeatherProvider()

    async def get_current_weather(
        self,
        location: Optional[str] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> WeatherDataResponse:
        return await self.live_provider.get_weather(location or "Vadodara, Gujarat, India", lat, lng)


weather_service = WeatherService()
