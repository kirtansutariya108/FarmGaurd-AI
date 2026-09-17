import logging
from typing import Optional, List, Dict, Any, Tuple

from app.schemas.intelligence import FarmIntelligenceData, WeatherSummary
from app.schemas.weather import WeatherDataResponse

logger = logging.getLogger("farm_intelligence")

CONFIDENCE_THRESHOLD = 60.0  # Percentage threshold (60% or 0.60)

# ==============================================================================
# 16-CLASS DETERMINISTIC AGRONOMIC KNOWLEDGE BASE
# ==============================================================================
DISEASE_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    # ─── TOMATO CLASSES (10) ──────────────────────────────────────────────────
    "bacterial_spot": {
        "displayName": "Bacterial Spot",
        "crop": "Tomato",
        "severity": "high",
        "summary": "A bacterial disease caused by Xanthomonas species producing water-soaked foliar lesions that turn dark brown with greasy margins.",
        "riskFactors": [
            "Prolonged leaf wetness and high relative humidity (>80%)",
            "Warm ambient temperatures (24°C–30°C)",
            "Rainfall splashing dispersing bacterial ooze across plants",
            "Handling foliage while wet from rain or dew"
        ],
        "immediateActions": [
            "Avoid overhead sprinkler watering to eliminate splash transmission.",
            "Sanitize pruning tools and stakes before moving between crop rows.",
            "Avoid entering or cultivating wet fields to prevent spreading bacterial exudates.",
            "Follow locally approved bactericidal disease-management practices and product labels."
        ],
        "monitoringActions": [
            "Inspect young upper foliage and developing fruit for water-soaked circular lesions.",
            "Check lower canopy leaves daily following rain or overhead moisture events.",
            "Monitor adjacent rows for early symptom emergence."
        ],
        "preventionActions": [
            "Use certified disease-free seeds and certified healthy transplants.",
            "Ensure generous plant spacing and trellising to facilitate air circulation.",
            "Practice crop rotation with non-solanaceous crops for at least 2 years.",
            "Follow locally recommended preventive cultural practices."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (24.0, 32.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "drizzle", "shower", "thunderstorm", "humid"]
        }
    },
    "early_blight": {
        "displayName": "Early Blight",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "A common fungal disease caused by Alternaria solani characterized by concentric ring (bullseye) brown lesions starting on older lower foliage.",
        "riskFactors": [
            "Alternating wet and dry weather cycles",
            "Moderate-to-warm temperatures (22°C–29°C)",
            "Extended canopy wetness from heavy dew or irrigation",
            "Nutrient-deficient or physiologically stressed plants"
        ],
        "immediateActions": [
            "Prune severely affected lower leaves touching or near the soil surface.",
            "Ensure targeted base or drip irrigation to keep foliage dry.",
            "Improve plant trellising to elevate lower foliage away from damp soil.",
            "Follow locally approved foliar protective management guidance."
        ],
        "monitoringActions": [
            "Inspect lower and mid-canopy leaves for expanding concentric ring lesions.",
            "Monitor lesion progression upward through the plant canopy every 48 hours.",
            "Track yellowing chlorotic halos expanding around target lesions."
        ],
        "preventionActions": [
            "Apply organic mulch around plant bases to establish a soil-splash barrier.",
            "Maintain balanced soil nutrition, avoiding nitrogen deficiency during fruiting.",
            "Ensure adequate row spacing to encourage rapid canopy drying.",
            "Rotate tomato plots with non-host crops on a 2–3 year cycle."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (22.0, 30.0),
            "criticalHumidity": 75.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "shower", "humid", "cloudy"]
        }
    },
    "healthy": {
        "displayName": "Healthy Foliage",
        "crop": "Tomato",
        "severity": "low",
        "summary": "Tomato foliage displays vibrant chlorophyll pigmentation and intact leaf architecture. No active pathogen lesion patterns detected.",
        "riskFactors": [
            "No active disease risk factors currently identified."
        ],
        "immediateActions": [
            "Continue regular field monitoring and routine crop scouting.",
            "Maintain consistent drip irrigation and balanced crop fertigation schedules.",
            "Keep field margins and tools clean and sanitized."
        ],
        "monitoringActions": [
            "Perform routine visual foliar scouting every 5–7 days.",
            "Examine lower leaf undersides periodically for early pest or spore arrivals.",
            "Record this diagnostic scan as a healthy benchmark for future comparison."
        ],
        "preventionActions": [
            "Maintain balanced soil fertility and steady rootzone hydration.",
            "Ensure effective weed control along field borders to eliminate insect reservoirs.",
            "Sustain preventive crop hygiene practices throughout the growing cycle."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (18.0, 30.0),
            "criticalHumidity": 90.0,
            "rainRisk": False,
            "conditionKeywords": []
        }
    },
    "late_blight": {
        "displayName": "Late Blight",
        "crop": "Tomato",
        "severity": "high",
        "summary": "An aggressive water-mold disease caused by Phytophthora infestans that can spread rapidly across fields under cool, persistently wet and humid conditions.",
        "riskFactors": [
            "Cool ambient temperatures (15°C–22°C)",
            "High relative humidity (>85% RH)",
            "Prolonged leaf wetness exceeding 6–8 continuous hours",
            "Frequent rainfall, dense morning fog, or heavy overcast skies"
        ],
        "immediateActions": [
            "Inspect surrounding plants immediately for expanding water-soaked lesions.",
            "Remove severely affected material where appropriate and dispose of safely away from fields.",
            "Halt all overhead sprinkling immediately to reduce canopy wetness duration.",
            "Follow locally approved protective disease-management practices and product labels."
        ],
        "monitoringActions": [
            "Check leaf undersides in early morning for delicate white sporulation.",
            "Inspect stems and green fruit clusters for greasy dark-brown lesions.",
            "Recheck the entire plot thoroughly after any rain or fog event."
        ],
        "preventionActions": [
            "Avoid unnecessary foliar wetness by utilizing base or drip irrigation.",
            "Maintain wide plant spacing to maximize cross-canopy air circulation.",
            "Use certified healthy, disease-free planting stock.",
            "Follow locally recommended preventive agricultural practices ahead of rainy weather."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (14.0, 23.0),
            "criticalHumidity": 85.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "drizzle", "fog", "shower", "overcast", "cloudy"]
        }
    },
    "leaf_mold": {
        "displayName": "Leaf Mold",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "A fungal foliar disease caused by Passalora fulva producing pale greenish-yellow patches on upper leaf surfaces and velvety olive-brown mold on undersides.",
        "riskFactors": [
            "Persistent high relative humidity (>85% RH)",
            "Moderate ambient temperatures (20°C–25°C)",
            "Poor air circulation within dense canopies or greenhouse structures",
            "Dense, overcrowded plant spacing"
        ],
        "immediateActions": [
            "Prune dense lower foliage to significantly improve air movement through the canopy.",
            "Water strictly at the soil base to keep leaves dry.",
            "Increase greenhouse or field ventilation where practical.",
            "Follow locally approved management guidance and product recommendations."
        ],
        "monitoringActions": [
            "Inspect leaf undersides for velvety olive-green mold progression.",
            "Check middle and upper canopy foliage for newly developing yellow chlorotic patches.",
            "Track relative humidity levels in sheltered or dense canopy zones."
        ],
        "preventionActions": [
            "Maintain optimal row spacing and trellis height to enhance airflow.",
            "Avoid overhead irrigation during humid or overcast periods.",
            "Ensure active ventilation in protected structures during morning hours.",
            "Select resistant tomato varieties for future replanting cycles."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (20.0, 26.0),
            "criticalHumidity": 85.0,
            "rainRisk": True,
            "conditionKeywords": ["humid", "rain", "fog", "cloudy", "overcast"]
        }
    },
    "mosaic_virus": {
        "displayName": "Mosaic Virus",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "A viral infection (such as Tomato Mosaic Virus) causing mottled light and dark green patterns, leaf distortion, puckering, and stunted growth.",
        "riskFactors": [
            "Mechanical transmission via pruning shears, tools, and plant handling",
            "Presence of sap-feeding insect vectors (aphids, thrips)",
            "Infected crop debris or reservoir weeds surrounding the field"
        ],
        "immediateActions": [
            "Rogue out and safely dispose of severely stunted or infected plants to protect healthy rows.",
            "Sanitize hands, pruning tools, and stakes thoroughly with soapy water or disinfectant.",
            "Avoid handling healthy foliage immediately after touching symptomatic plants.",
            "Follow locally recommended vector-management practices."
        ],
        "monitoringActions": [
            "Watch new terminal growth for mosaic mottling or distorted strap-like leaves.",
            "Monitor aphid and vector insect populations along plant margins.",
            "Check neighbouring rows for emerging viral symptoms."
        ],
        "preventionActions": [
            "Use virus-free certified seeds and transplants.",
            "Control weed hosts around field perimeters that harbor viral pathogens.",
            "Wash and disinfect tools between handling cycles.",
            "Plant virus-resistant tomato cultivars where available."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (22.0, 35.0),
            "criticalHumidity": 90.0,
            "rainRisk": False,
            "conditionKeywords": ["warm", "clear", "sunny"]
        }
    },
    "septoria_leaf_spot": {
        "displayName": "Septoria Leaf Spot",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "A fungal disease caused by Septoria lycopersici producing numerous small circular spots with gray-tan centers and dark brown margins starting on lower leaves.",
        "riskFactors": [
            "Extended periods of warm, wet weather (20°C–26°C)",
            "High humidity and prolonged morning dew",
            "Water splashing from soil onto lower foliage",
            "Dense canopy trapping moisture near the ground"
        ],
        "immediateActions": [
            "Remove heavily spotted lower leaves and dispose of them away from the field.",
            "Avoid overhead sprinkling that causes water droplets to splash onto leaves.",
            "Improve canopy ventilation through proper staking and sucker pruning.",
            "Follow locally approved agricultural guidance and label instructions."
        ],
        "monitoringActions": [
            "Monitor lower leaves closely for new small dark specks after rain events.",
            "Check whether spot progression is ascending into the middle canopy.",
            "Inspect stems and calyxes for spot development."
        ],
        "preventionActions": [
            "Apply mulch beneath plants to create a barrier against soil-splash.",
            "Rotate tomato crops with non-solanaceous species on a 2–3 year rotation.",
            "Maintain adequate spacing between rows to promote rapid drying.",
            "Clear and compost infected garden debris away from active planting zones."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (20.0, 27.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "drizzle", "shower", "humid"]
        }
    },
    "target_spot": {
        "displayName": "Target Spot",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "A fungal disease caused by Corynespora cassiicola causing brown circular lesions with concentric rings and distinct margins on leaves, stems, and fruit.",
        "riskFactors": [
            "Warm ambient temperatures (25°C–32°C)",
            "High relative humidity (>80% RH)",
            "Dense, lush vegetative canopy",
            "Frequent rainfall or overhead irrigation"
        ],
        "immediateActions": [
            "Prune lower infected foliage to reduce fungal inoculum load.",
            "Ensure proper staking and canopy ventilation to accelerate drying.",
            "Switch strictly to targeted base or drip irrigation.",
            "Follow locally approved protective disease-management practices."
        ],
        "monitoringActions": [
            "Inspect both foliage and developing green fruit for target-like brown spots.",
            "Check for lesion expansion during humid spells.",
            "Scout surrounding tomato blocks every 3–4 days."
        ],
        "preventionActions": [
            "Maintain balanced fertilizer applications, avoiding excessive nitrogen.",
            "Ensure good row spacing for maximum sunlight penetration.",
            "Clear infected crop residues post-harvest.",
            "Follow regional preventive management practices."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (25.0, 32.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "shower", "humid", "thunderstorm"]
        }
    },
    "twospotted_spider_mite": {
        "displayName": "Two-Spotted Spider Mite",
        "crop": "Tomato",
        "severity": "moderate",
        "summary": "An infestation of Tetranychus urticae causing fine yellow-white stippling on leaf surfaces, bronze discoloration, and fine webbing on undersides.",
        "riskFactors": [
            "Hot, dry weather conditions (>30°C, <50% RH)",
            "Dusty field environments and perimeter roads",
            "Overuse of broad-spectrum insecticides killing natural predators",
            "Drought-stressed or water-deficient plants"
        ],
        "immediateActions": [
            "Apply a fine water spray or approved organic horticultural wash to leaf undersides.",
            "Avoid broad-spectrum chemical sprays that destroy natural predatory mites.",
            "Maintain adequate field and soil hydration to reduce plant stress.",
            "Follow locally approved integrated pest management (IPM) practices."
        ],
        "monitoringActions": [
            "Examine leaf undersides with a hand lens for active mites and fine webbing.",
            "Check for increasing yellow stippling on sunlit upper foliage.",
            "Monitor field borders and dusty perimeter rows for early hotspots."
        ],
        "preventionActions": [
            "Encourage beneficial natural predators (such as predatory mites and ladybugs).",
            "Keep perimeter access roads damp to suppress airborne dust.",
            "Ensure regular irrigation to prevent plant drought stress.",
            "Remove heavily infested host weeds around field perimeters."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (30.0, 45.0),
            "criticalHumidity": 50.0,  # favored by LOW humidity
            "isLowHumidityRisk": True,
            "rainRisk": False,
            "conditionKeywords": ["clear", "sun", "hot", "dry"]
        }
    },
    "yellow_leaf_curl_virus": {
        "displayName": "Yellow Leaf Curl Virus",
        "crop": "Tomato",
        "severity": "high",
        "summary": "A destructive viral disease (TYLCV) transmitted by whiteflies (Bemisia tabaci) causing pronounced upward leaf cupping, marginal chlorosis, and stunted bushiness.",
        "riskFactors": [
            "High whitefly vector populations in the area",
            "Warm, dry weather favoring rapid whitefly reproduction",
            "Adjacent infested crops or reservoir weed hosts",
            "Young plant vulnerability during early vegetative stages"
        ],
        "immediateActions": [
            "Deploy yellow sticky traps across the plot to monitor and suppress whitefly activity.",
            "Rogue out severely stunted or cupped plants to eliminate virus reservoirs.",
            "Use fine insect-exclusion netting over seedling nurseries.",
            "Follow locally recommended whitefly management practices."
        ],
        "monitoringActions": [
            "Check new terminal growth for upward cupping and yellowing margins.",
            "Inspect leaf undersides for tiny whitefly adults and nymphs.",
            "Monitor surrounding solanaceous weeds and crops for vector presence."
        ],
        "preventionActions": [
            "Plant TYLCV-resistant tomato hybrids where available.",
            "Use reflective or silver mulches to deter whitefly vectors.",
            "Protect young nursery transplants with fine insect screens.",
            "Eliminate alternate weed hosts around field margins."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (26.0, 38.0),
            "criticalHumidity": 65.0,
            "rainRisk": False,
            "conditionKeywords": ["clear", "sunny", "warm", "dry"]
        }
    },

    # ─── RICE CLASSES (6) ─────────────────────────────────────────────────────
    "rice_bacterial_leaf_blight": {
        "displayName": "Bacterial Leaf Blight",
        "crop": "Rice",
        "severity": "high",
        "summary": "A major bacterial disease caused by Xanthomonas oryzae pv. oryzae producing water-soaked wavy lesions along leaf margins that turn yellowish-white.",
        "riskFactors": [
            "Warm temperatures (25°C–34°C)",
            "High relative humidity (>80%) and persistent rainfall",
            "Strong winds causing foliar micro-abrasions that facilitate bacterial entry",
            "Excessive nitrogen fertilizer application"
        ],
        "immediateActions": [
            "Inspect surrounding tillers and flag leaves for wavy water-soaked lesions.",
            "Drain standing paddy water temporarily to lower microclimate relative humidity.",
            "Suspend excess nitrogen top-dressing; maintain balanced potassium fertilization.",
            "Avoid moving through wet fields to prevent physical transmission of bacterial ooze.",
            "Follow locally approved bactericidal/agronomic management practices."
        ],
        "monitoringActions": [
            "Scout flag leaves during tillering and panicle initiation stages.",
            "Check for milky bacterial exudate droplets during early humid mornings.",
            "Monitor the rate of lesion elongation toward the leaf base."
        ],
        "preventionActions": [
            "Use certified disease-resistant rice cultivars suited to the region.",
            "Maintain balanced nitrogen-to-potassium fertilizer ratios.",
            "Ensure clean field bunds and weed-free irrigation channels.",
            "Avoid field-to-field water flow from affected plots into healthy fields."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (25.0, 34.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "drizzle", "shower", "thunderstorm", "humid"]
        }
    },
    "rice_brown_spot": {
        "displayName": "Brown Spot",
        "crop": "Rice",
        "severity": "moderate",
        "summary": "A fungal disease caused by Bipolaris oryzae producing oval to circular brown spots with distinct yellow halos across the rice leaf lamina.",
        "riskFactors": [
            "Nutritional imbalance, particularly potassium or micronutrient deficiency",
            "Intermittent drought stress or moisture fluctuations in the paddy",
            "High relative humidity (>85%) with moderate temperatures (25°C–30°C)",
            "Nutrient-depleted or unconditioned soil"
        ],
        "immediateActions": [
            "Maintain uniform paddy water level to prevent soil moisture stress cycles.",
            "Apply balanced foliar potassium and micronutrients to strengthen foliar tissue.",
            "Inspect upper leaves and panicles for spot density progression.",
            "Follow locally approved agronomic recommendations and product guidance."
        ],
        "monitoringActions": [
            "Scout upper leaves every 48–72 hours for expanding brown lesions.",
            "Check for spot emergence on developing grains and glumes.",
            "Monitor soil moisture to prevent extreme drying-wetting stress cycles."
        ],
        "preventionActions": [
            "Ensure balanced soil fertility management based on soil testing.",
            "Use treated, disease-free certified rice seeds.",
            "Avoid severe water stress during vegetative and reproductive stages.",
            "Incorporate organic matter to improve soil water-holding capacity."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (24.0, 32.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "shower", "humid", "cloudy"]
        }
    },
    "rice_healthy": {
        "displayName": "Healthy Foliage",
        "crop": "Rice",
        "severity": "low",
        "summary": "Rice tillers display uniform emerald-green coloration, healthy leaf blade architecture, and no visible pathogen signatures.",
        "riskFactors": [
            "No active foliar pathogen risk factors currently detected."
        ],
        "immediateActions": [
            "Continue regular paddy water management and nutrient schedules.",
            "Perform routine weekly field scouting across all tillers.",
            "Maintain clean bunds and free-flowing irrigation channels."
        ],
        "monitoringActions": [
            "Conduct routine foliar scouting at 5–7 day intervals.",
            "Inspect flag leaves closely as heading and panicle emergence approaches.",
            "Record this scan as a healthy reference benchmark for future comparisons."
        ],
        "preventionActions": [
            "Maintain optimal water depth tailored to the current crop growth stage.",
            "Follow split-nitrogen application guidelines balanced with adequate potassium.",
            "Keep bunds weed-free to eliminate alternate pest and pathogen hosts."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (20.0, 32.0),
            "criticalHumidity": 90.0,
            "rainRisk": False,
            "conditionKeywords": []
        }
    },
    "rice_leaf_blast": {
        "displayName": "Leaf Blast",
        "crop": "Rice",
        "severity": "high",
        "summary": "A destructive fungal disease caused by Magnaporthe oryzae producing spindle-shaped or diamond lesions with gray-white centers and dark brown borders.",
        "riskFactors": [
            "Cool night temperatures (17°C–23°C) combined with high daytime humidity (>90%)",
            "Extended leaf wetness / heavy morning dew exceeding 10 hours",
            "Excessive nitrogen fertilization leading to lush, soft leaf tissue",
            "Overcast skies, light drizzling rain, or persistent fog"
        ],
        "immediateActions": [
            "Maintain steady water depth in the paddy field to buffer canopy microclimate.",
            "Halt further nitrogen top-dressing immediately to avoid lush susceptible tissue.",
            "Inspect flag leaves and neck nodes carefully for spindle-shaped lesions.",
            "Follow locally recommended blast management guidance and approved products."
        ],
        "monitoringActions": [
            "Scout leaves daily during prolonged cool, cloudy, or foggy weather periods.",
            "Monitor collar and neck nodes during panicle emergence for blast symptoms.",
            "Check adjacent fields and regional advisories for blast outbreak warnings."
        ],
        "preventionActions": [
            "Plant blast-resistant rice varieties adapted to the agro-climatic zone.",
            "Avoid excessive or late nitrogen fertilizer applications.",
            "Adjust sowing time to avoid heading during peak cool, humid seasonal windows.",
            "Ensure adequate seedling spacing for good canopy aeration."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (17.0, 25.0),
            "criticalHumidity": 85.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "drizzle", "fog", "cloudy", "overcast", "humid"]
        }
    },
    "rice_leaf_scald": {
        "displayName": "Leaf Scald",
        "crop": "Rice",
        "severity": "moderate",
        "summary": "A fungal disease caused by Microdochium oryzae producing zonate chevron-like banded lesions progressing from leaf tips with alternating light and dark brown bands.",
        "riskFactors": [
            "High relative humidity (>80%) and frequent rainfall events",
            "Warm temperatures (25°C–30°C)",
            "High crop planting density and lush canopy",
            "Excessive nitrogen application without balanced potassium"
        ],
        "immediateActions": [
            "Avoid further high-nitrogen applications during active tillering.",
            "Maintain adequate potassium levels to reinforce foliar cell walls.",
            "Ensure proper field drainage to lower canopy humidity.",
            "Follow locally approved management practices and guidelines."
        ],
        "monitoringActions": [
            "Check leaf tips and upper third of blades for chevron-patterned bands.",
            "Monitor lesion progression toward the leaf sheath during heading.",
            "Scout tillers following persistent rain or heavy dew spells."
        ],
        "preventionActions": [
            "Use clean, certified disease-free seed sources.",
            "Maintain optimal planting density for adequate cross-canopy airflow.",
            "Avoid unbalanced high-nitrogen fertilization.",
            "Clear and compost infected crop residues after harvest."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (24.0, 31.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "shower", "humid", "cloudy"]
        }
    },
    "rice_narrow_brown_spot": {
        "displayName": "Narrow Brown Spot",
        "crop": "Rice",
        "severity": "moderate",
        "summary": "A fungal disease caused by Cercospora janseana producing short, narrow linear brown lesions parallel to the leaf veins.",
        "riskFactors": [
            "Crop approaching heading to ripening maturity stages",
            "Potassium deficiency in soil",
            "Warm and humid weather conditions",
            "Prolonged leaf moisture from dew or rain"
        ],
        "immediateActions": [
            "Assess soil potassium availability and provide balanced nutrition.",
            "Maintain stable paddy water management without drying stress.",
            "Inspect upper leaves and panicle branches for linear brown stripes.",
            "Follow locally approved agricultural extension guidance."
        ],
        "monitoringActions": [
            "Scout flag leaves and upper canopy during heading and grain filling.",
            "Check for lesion expansion on leaf sheaths and glumes.",
            "Track overall foliar senescence rate in the plot."
        ],
        "preventionActions": [
            "Apply balanced potassium and nitrogen fertilizers according to soil test recommendations.",
            "Use resistant varieties suited for late-season disease tolerance.",
            "Ensure optimal plant spacing and steady water management.",
            "Practice crop rotation where practical."
        ],
        "weatherCorrelation": {
            "favoredTempRange": (24.0, 32.0),
            "criticalHumidity": 80.0,
            "rainRisk": True,
            "conditionKeywords": ["rain", "humid", "cloudy"]
        }
    }
}


def _normalize_disease_key(raw_disease: str) -> str:
    """Normalize input disease string to standard 16-class dictionary key."""
    d = raw_disease.strip().lower().replace(" ", "_").replace("-", "_")
    
    # Direct match
    if d in DISEASE_KNOWLEDGE_BASE:
        return d
    
    # Specific mappings
    mapping = {
        "bacterial_leaf_blight": "rice_bacterial_leaf_blight",
        "brown_spot": "rice_brown_spot",
        "leaf_blast": "rice_leaf_blast",
        "leaf_scald": "rice_leaf_scald",
        "narrow_brown_spot": "rice_narrow_brown_spot",
        "spider_mite": "twospotted_spider_mite",
        "two_spotted_spider_mite": "twospotted_spider_mite",
        "tylcv": "yellow_leaf_curl_virus",
        "tomato_yellow_leaf_curl_virus": "yellow_leaf_curl_virus",
        "septoria": "septoria_leaf_spot",
        "healthy_foliage": "healthy",
        "rice_healthy_foliage": "rice_healthy",
    }
    if d in mapping:
        return mapping[d]
    
    # Fuzzy keyword search across keys
    for k in DISEASE_KNOWLEDGE_BASE:
        if k in d or d in k:
            return k
            
    # Fallback to tomato healthy or rice healthy
    if "rice" in d:
        return "rice_healthy" if "health" in d else "rice_bacterial_leaf_blight"
    return "healthy" if "health" in d else "early_blight"


class FarmIntelligenceService:
    """
    Deterministic agricultural recommendation and weather-aware risk engine.
    Correlates AI disease diagnosis with live hyper-local weather telemetry
    and agronomic rules across all 16 plant disease classes.
    """

    def generate_advisory(
        self,
        disease: str,
        confidence: float,
        crop: Optional[str] = None,
        weather: Optional[WeatherDataResponse] = None
    ) -> FarmIntelligenceData:
        """
        Synthesizes disease diagnosis and live agro-climatic context into a structured recommendation.
        """
        # 1. Normalize confidence (convert to 0-100 percentage scale if given as 0.0-1.0)
        conf_pct = confidence * 100.0 if confidence <= 1.0 else confidence
        conf_pct = round(conf_pct, 2)
        is_low_conf = conf_pct < CONFIDENCE_THRESHOLD

        # 2. Normalize disease key & retrieve knowledge
        norm_key = _normalize_disease_key(disease)
        profile = DISEASE_KNOWLEDGE_BASE.get(norm_key, DISEASE_KNOWLEDGE_BASE["early_blight"])

        # Determine effective crop
        effective_crop = crop if crop and crop.strip() else profile["crop"]
        if norm_key.startswith("rice_"):
            effective_crop = "Rice"
        elif norm_key in ["bacterial_spot", "early_blight", "late_blight", "leaf_mold", "mosaic_virus", 
                          "septoria_leaf_spot", "target_spot", "twospotted_spider_mite", "yellow_leaf_curl_virus"]:
            effective_crop = "Tomato"

        is_healthy = "healthy" in norm_key

        # 3. Weather telemetry processing
        weather_available = weather is not None
        weather_summary: Optional[WeatherSummary] = None
        weather_advice: List[str] = []
        weather_risk_level: str = "LOW"

        if weather_available and weather is not None:
            temp = weather.currentTemp
            humidity = weather.humidity
            rain_prob = weather.rainProbability
            precip_mm = weather.precipitationMm
            wind_speed = weather.windSpeedKmH
            condition = weather.condition
            location = weather.location

            weather_summary = WeatherSummary(
                location=location,
                currentTemp=temp,
                condition=condition,
                humidity=humidity,
                rainProbability=rain_prob,
                windSpeedKmH=wind_speed,
                precipitationMm=precip_mm,
                soilTemp=weather.soilTemp,
                uvIndex=weather.uvIndex
            )

            # 4. Weather Risk Engine (Deterministic)
            correlation = profile.get("weatherCorrelation", {})
            favored_temp = correlation.get("favoredTempRange", (20.0, 30.0))
            critical_hum = correlation.get("criticalHumidity", 80.0)
            is_low_hum_risk = correlation.get("isLowHumidityRisk", False)
            rain_risk = correlation.get("rainRisk", True)
            condition_keywords = correlation.get("conditionKeywords", [])

            risk_points = 0
            weather_factors_list: List[str] = []

            if not is_healthy and not is_low_conf:
                # Check temperature favorability
                if favored_temp[0] <= temp <= favored_temp[1]:
                    risk_points += 1
                    weather_factors_list.append(f"Ambient temperature ({temp:.1f}°C) is within the favorable range ({favored_temp[0]:.0f}–{favored_temp[1]:.0f}°C).")
                elif temp > favored_temp[1] + 5.0 or temp < favored_temp[0] - 5.0:
                    weather_factors_list.append(f"Ambient temperature ({temp:.1f}°C) is outside peak pathogen metabolic range.")

                # Check humidity favorability
                if is_low_hum_risk:
                    # For spider mites (favored by dry weather)
                    if humidity <= critical_hum:
                        risk_points += 2
                        weather_factors_list.append(f"Low ambient humidity ({humidity:.0f}%) creates dry conditions favoring spider mite reproduction.")
                    else:
                        weather_factors_list.append(f"Elevated humidity ({humidity:.0f}%) naturally suppresses mite multiplication.")
                else:
                    # For fungal/bacterial pathogens (favored by wetness)
                    if humidity >= critical_hum:
                        risk_points += 2
                        weather_factors_list.append(f"Elevated relative humidity ({humidity:.0f}%) promotes foliar moisture retention and spore germination.")
                    elif humidity >= 65.0:
                        risk_points += 1
                        weather_factors_list.append(f"Moderate humidity ({humidity:.0f}%) supports potential foliar moisture.")
                    else:
                        weather_factors_list.append(f"Dry ambient humidity ({humidity:.0f}%) is less favorable for foliar pathogen proliferation.")

                # Check precipitation / rain probability
                if rain_risk:
                    if rain_prob >= 60.0 or precip_mm >= 2.0:
                        risk_points += 2
                        weather_factors_list.append(f"High precipitation likelihood ({rain_prob:.0f}%, {precip_mm:.1f}mm) significantly extends canopy wetness duration.")
                    elif rain_prob >= 30.0 or precip_mm > 0.0:
                        risk_points += 1
                        weather_factors_list.append(f"Scattered rain likelihood ({rain_prob:.0f}%) may increase leaf surface dampness.")
                    else:
                        weather_factors_list.append(f"Low rain chance ({rain_prob:.0f}%) helps keep the canopy dry.")

                # Check wind speed (dispersion of spores / bacteria)
                if wind_speed >= 18.0:
                    risk_points += 1
                    weather_factors_list.append(f"Brisk wind velocity ({wind_speed:.1f} km/h) can cause micro-abrasions and disperse inoculum.")

                # Condition text match
                cond_lower = condition.lower() if condition else ""
                if any(kw in cond_lower for kw in condition_keywords):
                    risk_points += 1

                # Deterministic Risk Level mapping
                if risk_points >= 4:
                    weather_risk_level = "HIGH"
                    weather_advice = [
                        "Current weather conditions may favor disease development because humidity and rainfall probability are elevated.",
                        "Inspect canopy closely and postpone overhead irrigation cycles."
                    ]
                elif risk_points >= 2:
                    weather_risk_level = "MODERATE"
                    weather_advice = [
                        "Weather conditions moderately support disease progression. Regular scouting is recommended.",
                        "Ensure adequate drainage and monitor leaf wetness."
                    ]
                else:
                    weather_risk_level = "LOW"
                    weather_advice = [
                        "Current weather conditions are less favorable for moisture-related disease spread, but continue monitoring.",
                        "Maintain standard preventive field practices."
                    ]
            elif is_healthy:
                weather_risk_level = "LOW"
                weather_factors_list.append(f"Optimal conditions: {condition}, {temp:.1f}°C, {humidity:.0f}% RH.")
                weather_advice = [
                    f"Current weather conditions ({condition}, {temp:.1f}°C) support standard healthy vegetative growth.",
                    "Continue routine scouting and maintain regular irrigation schedules."
                ]
            else:
                # Low confidence
                weather_risk_level = "LOW"
                weather_factors_list.append(f"Weather context: {condition}, {temp:.1f}°C, {humidity:.0f}% RH.")
                weather_advice = [
                    "Weather telemetry is recorded. Please upload a clearer leaf photo for correlated disease-risk analysis."
                ]
        else:
            # Weather unavailable
            weather_risk_level = "UNAVAILABLE"
            weather_factors_list = []
            weather_advice = [
                "Weather information is currently unavailable. Showing disease-based guidance only."
            ]

        # 5. Handle Low Confidence & Healthy output payloads
        if is_low_conf:
            return FarmIntelligenceData(
                disease="Uncertain Classification",
                crop=effective_crop,
                confidence=conf_pct,
                severity="low",
                summary="The uploaded image could not be classified with high confidence (below 60% diagnostic threshold). Please capture another clear image of the leaf in good daylight.",
                weatherRisk=weather_risk_level if weather_available else "UNAVAILABLE",
                weatherAvailable=weather_available,
                riskFactors=[
                    "Image quality, lighting, or focus is insufficient for reliable diagnosis."
                ],
                immediateActions=[
                    "Retake photo under uniform natural daylight focusing directly on the leaf.",
                    "Ensure the leaf fills at least 60% of the camera frame.",
                    "Avoid heavy glare, shadows, and blurry focus."
                ],
                monitoringActions=[
                    "Inspect the plant visually for any clear symptoms.",
                    "Consult an agricultural expert if symptoms persist."
                ],
                preventionActions=[
                    "Maintain standard crop hygiene and monitoring routines."
                ],
                weatherAdvice=weather_advice,
                weatherSummary=weather_summary,
                disclaimer="AI confidence is below the diagnostic threshold. No specific chemical or protective treatments should be applied based on uncertain classifications.",
                riskLevel="Low",
                advisory="AI confidence is low. Please capture another clear photo under natural daylight.",
                actions=[
                    "Retake photo in clear natural daylight.",
                    "Ensure affected foliage is centered and in sharp focus."
                ],
                weatherFactors=weather_factors_list
            )

        if is_healthy:
            return FarmIntelligenceData(
                disease="Healthy Foliage Detected",
                crop=effective_crop,
                confidence=conf_pct,
                severity="low",
                summary=profile["summary"],
                weatherRisk=weather_risk_level if weather_available else "UNAVAILABLE",
                weatherAvailable=weather_available,
                riskFactors=profile["riskFactors"],
                immediateActions=profile["immediateActions"],
                monitoringActions=profile["monitoringActions"],
                preventionActions=profile["preventionActions"],
                weatherAdvice=weather_advice,
                weatherSummary=weather_summary,
                disclaimer="Foliage appears healthy. Continue regular field monitoring and routine management.",
                riskLevel="Low",
                advisory=profile["summary"],
                actions=profile["immediateActions"],
                weatherFactors=weather_factors_list
            )

        # Standard Confident Disease Case
        return FarmIntelligenceData(
            disease=profile["displayName"],
            crop=effective_crop,
            confidence=conf_pct,
            severity=profile["severity"],
            summary=profile["summary"],
            weatherRisk=weather_risk_level if weather_available else "UNAVAILABLE",
            weatherAvailable=weather_available,
            riskFactors=profile["riskFactors"],
            immediateActions=profile["immediateActions"],
            monitoringActions=profile["monitoringActions"],
            preventionActions=profile["preventionActions"],
            weatherAdvice=weather_advice,
            weatherSummary=weather_summary,
            disclaimer=(
                "This AI result is a decision-support indication based on the uploaded image "
                "and available weather information. Confirm uncertain cases with a qualified agricultural "
                "expert before applying crop-protection products."
            ),
            riskLevel="High" if profile["severity"] == "high" else ("Moderate" if profile["severity"] == "moderate" else "Low"),
            advisory=profile["summary"],
            actions=profile["immediateActions"],
            weatherFactors=weather_factors_list
        )


farm_intelligence_service = FarmIntelligenceService()

