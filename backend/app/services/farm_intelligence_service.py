import logging
from typing import Optional, List, Dict, Any

from app.schemas.intelligence import FarmIntelligenceData, WeatherSummary
from app.schemas.weather import WeatherDataResponse

logger = logging.getLogger("farm_intelligence")


class FarmIntelligenceService:
    """
    Deterministic agricultural intelligence engine that correlates AI-diagnosed
    rice leaf conditions with local real-time weather telemetry and agronomic rules.
    """

    def generate_advisory(
        self,
        disease: str,
        confidence: float,
        weather: Optional[WeatherDataResponse] = None
    ) -> FarmIntelligenceData:
        """
        Synthesizes disease diagnosis and live agro-climatic context into a structured advisory.
        """
        # Extract weather parameters with safe fallbacks
        temp = weather.currentTemp if weather else 28.0
        humidity = weather.humidity if weather else 70.0
        rain_prob = weather.rainProbability if weather else 20.0
        precip_mm = weather.precipitationMm if weather else 0.0
        wind_speed = weather.windSpeedKmH if weather else 10.0
        condition = weather.condition if weather else "Partly Cloudy"
        location = weather.location if weather else "Local Farm"

        weather_factors: List[str] = []
        weather_risk_level = "Normal"

        # 1. Analyze Environmental Factors
        if humidity >= 80.0:
            weather_factors.append(f"Elevated relative humidity ({humidity:.0f}%) promotes foliar moisture retention")
            weather_risk_level = "Elevated"
        elif humidity < 50.0:
            weather_factors.append(f"Low ambient humidity ({humidity:.0f}%)")

        if rain_prob >= 60.0 or precip_mm > 2.0:
            weather_factors.append(f"Precipitation likelihood ({rain_prob:.0f}%, {precip_mm:.1f}mm) increases canopy wetness duration")
            weather_risk_level = "High" if weather_risk_level == "Elevated" else "Elevated"
        elif rain_prob >= 30.0:
            weather_factors.append(f"Scattered rain possible ({rain_prob:.0f}%)")

        if temp >= 32.0:
            weather_factors.append(f"Warm ambient temperature ({temp:.1f}°C) within favorable pathogen metabolic range")
        elif temp <= 20.0:
            weather_factors.append(f"Cool ambient temperature ({temp:.1f}°C)")
        else:
            weather_factors.append(f"Moderate temperature ({temp:.1f}°C)")

        if wind_speed >= 18.0:
            weather_factors.append(f"Brisk wind velocity ({wind_speed:.1f} km/h) can cause micro-abrasions and disperse inoculum")

        if not weather_factors:
            weather_factors.append(f"Standard weather conditions: {condition}, {temp:.1f}°C, {humidity:.0f}% RH")

        # 2. Disease-Specific Deterministic Agronomic Rules
        disease_lower = disease.strip().lower()
        actions: List[str] = []
        advisory: str = ""
        risk_level = "Moderate"

        if "bacterial" in disease_lower:  # Bacterial leaf blight (Xanthomonas oryzae)
            if humidity >= 80.0 or rain_prob >= 60.0 or wind_speed >= 18.0:
                risk_level = "High"
                advisory = (
                    f"Current environmental conditions ({humidity:.0f}% humidity, {rain_prob:.0f}% rain chance) "
                    "favor leaf wetness and potential spread of bacterial exudates across adjacent tillers. "
                    "Prompt preventive field management is advised."
                )
            else:
                risk_level = "Moderate"
                advisory = (
                    "Bacterial leaf blight symptoms identified. Moderate weather allows for controlled field intervention "
                    "before ambient moisture increases."
                )

            actions = [
                "Inspect surrounding tillers and flag leaves for water-soaked wavy lesions.",
                "Drain standing field water temporarily to reduce microclimate relative humidity.",
                "Suspend excess nitrogen top-dressing; maintain balanced potassium fertilization.",
                "Avoid working in wet fields to prevent physical transmission of bacterial ooze.",
                "Consult local agricultural extension service for recommended bio-bactericide options."
            ]

        elif "brown" in disease_lower:  # Brown spot (Bipolaris oryzae)
            if humidity >= 75.0 or (temp >= 25.0 and temp <= 32.0):
                risk_level = "High" if humidity >= 85.0 else "Moderate"
                advisory = (
                    f"Ambient temperatures ({temp:.1f}°C) and humidity ({humidity:.0f}%) provide a favorable environment "
                    "for fungal spore germination and lesion enlargement. Soil nutrient balance is key."
                )
            else:
                risk_level = "Moderate"
                advisory = (
                    "Brown spot foliar symptoms detected. Often associated with physiological nutrient stress or moisture fluctuations."
                )

            actions = [
                "Monitor lesion density on upper leaves over the next 48 to 72 hours.",
                "Ensure steady paddy moisture without extreme wet-to-dry soil stress cycles.",
                "Evaluate soil nutrient status, prioritizing adequate potassium and micronutrients.",
                "Remove heavily infected tillers if localized to prevent secondary spore dispersal.",
                "Follow regional agricultural guidance for approved foliar protective management."
            ]

        elif "smut" in disease_lower:  # Leaf smut (Entyloma oryzae)
            if humidity >= 80.0:
                risk_level = "Moderate"
                advisory = (
                    f"High humidity ({humidity:.0f}%) may facilitate fungal maturation. Leaf smut is generally mild, "
                    "but crop canopy aeration should be maintained."
                )
            else:
                risk_level = "Low"
                advisory = (
                    "Leaf smut detected. Symptoms are typically localized and manageable under current weather conditions."
                )

            actions = [
                "Inspect flag leaves during grain-filling to ensure photosynthetic capacity is preserved.",
                "Ensure proper plant spacing and crop canopy aeration.",
                "Avoid high nitrogen applications that lead to dense, humid crop canopies.",
                "Record symptoms and follow local agricultural guidelines if severity increases."
            ]

        elif "healthy" in disease_lower:
            risk_level = "Low"
            advisory = (
                f"Crop foliage appears healthy and uniform. Current weather conditions ({condition}, {temp:.1f}°C) "
                "support standard vegetative growth."
            )
            actions = [
                "Continue standard irrigation and nutrient scheduling.",
                "Perform routine weekly scouting for early pest or pathogen indicators.",
                "Maintain clean bunds and irrigation channels."
            ]

        else:
            # General / Unclassified Condition
            risk_level = "Moderate"
            advisory = (
                f"Foliar irregularities observed. Current weather ({condition}, {humidity:.0f}% RH, {temp:.1f}°C) "
                "warrants regular visual crop monitoring."
            )
            actions = [
                "Examine both upper and lower leaf surfaces under clear daylight.",
                "Avoid unnecessary overhead watering that prolongs leaf wetness.",
                "Consult local agricultural officer or extension specialist with high-resolution photos."
            ]

        # Structure weather summary object
        weather_summary = WeatherSummary(
            location=location,
            currentTemp=temp,
            condition=condition,
            humidity=humidity,
            rainProbability=rain_prob,
            windSpeedKmH=wind_speed,
            precipitationMm=precip_mm,
            soilTemp=weather.soilTemp if weather else None,
            uvIndex=weather.uvIndex if weather else None
        ) if weather else None

        return FarmIntelligenceData(
            disease=disease,
            confidence=round(confidence, 2),
            riskLevel=risk_level,
            weatherRisk=weather_risk_level,
            advisory=advisory,
            actions=actions,
            weatherFactors=weather_factors,
            weatherSummary=weather_summary
        )


farm_intelligence_service = FarmIntelligenceService()
