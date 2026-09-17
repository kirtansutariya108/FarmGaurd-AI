import pytest
from app.services.farm_intelligence_service import farm_intelligence_service, DISEASE_KNOWLEDGE_BASE
from app.schemas.weather import WeatherDataResponse, ForecastDay


@pytest.fixture
def mock_weather_wet():
    """Wet, humid weather favorable to fungal/bacterial diseases."""
    return WeatherDataResponse(
        location="Vadodara, Gujarat, India",
        latitude=22.3072,
        longitude=73.1812,
        currentTemp=26.0,
        condition="Heavy Rain",
        humidity=88.0,
        rainProbability=80.0,
        windSpeedKmH=22.0,
        uvIndex=3.0,
        soilTemp=24.0,
        precipitationMm=5.0,
        forecast=[],
        farmInsight="Rainy conditions",
        lastUpdated="Just now",
        source="open-meteo"
    )


@pytest.fixture
def mock_weather_dry():
    """Dry, hot weather with low humidity."""
    return WeatherDataResponse(
        location="Vadodara, Gujarat, India",
        latitude=22.3072,
        longitude=73.1812,
        currentTemp=36.0,
        condition="Clear Sky",
        humidity=35.0,
        rainProbability=0.0,
        windSpeedKmH=8.0,
        uvIndex=9.0,
        soilTemp=32.0,
        precipitationMm=0.0,
        forecast=[],
        farmInsight="Hot and dry",
        lastUpdated="Just now",
        source="open-meteo"
    )


def test_all_16_classes_knowledge_base():
    """Ensure all 16 canonical classes have comprehensive agronomic profiles."""
    expected_classes = [
        # Tomato (10)
        "bacterial_spot", "early_blight", "healthy", "late_blight", "leaf_mold",
        "mosaic_virus", "septoria_leaf_spot", "target_spot", "twospotted_spider_mite",
        "yellow_leaf_curl_virus",
        # Rice (6)
        "rice_bacterial_leaf_blight", "rice_brown_spot", "rice_healthy",
        "rice_leaf_blast", "rice_leaf_scald", "rice_narrow_brown_spot"
    ]
    assert len(expected_classes) == 16
    for cls_key in expected_classes:
        assert cls_key in DISEASE_KNOWLEDGE_BASE, f"Missing {cls_key} in knowledge base"
        profile = DISEASE_KNOWLEDGE_BASE[cls_key]
        assert "displayName" in profile
        assert "crop" in profile
        assert "severity" in profile
        assert "summary" in profile
        assert len(profile["riskFactors"]) >= 1
        assert len(profile["immediateActions"]) >= 3
        assert len(profile["monitoringActions"]) >= 3
        assert len(profile["preventionActions"]) >= 3


def test_late_blight_with_wet_weather(mock_weather_wet):
    """Test Late Blight with high humidity/rain triggers HIGH weather risk."""
    res = farm_intelligence_service.generate_advisory(
        disease="late_blight",
        confidence=96.5,
        crop="Tomato",
        weather=mock_weather_wet
    )
    assert res.disease == "Late Blight"
    assert res.crop == "Tomato"
    assert res.confidence == 96.5
    assert res.severity == "high"
    assert res.weatherRisk == "HIGH"
    assert res.weatherAvailable is True
    assert res.weatherSummary is not None
    assert res.weatherSummary.humidity == 88.0
    assert len(res.immediateActions) >= 3
    assert len(res.monitoringActions) >= 3
    assert len(res.preventionActions) >= 3
    assert "decision-support" in res.disclaimer.lower()


def test_rice_bacterial_leaf_blight(mock_weather_wet):
    """Test Rice Bacterial Leaf Blight recommendation generation."""
    res = farm_intelligence_service.generate_advisory(
        disease="rice_bacterial_leaf_blight",
        confidence=92.0,
        crop="Rice",
        weather=mock_weather_wet
    )
    assert res.disease == "Bacterial Leaf Blight"
    assert res.crop == "Rice"
    assert res.weatherRisk == "HIGH"
    assert len(res.immediateActions) >= 3


def test_healthy_tomato_handling(mock_weather_wet):
    """Test that healthy foliage is not treated as a disease."""
    res = farm_intelligence_service.generate_advisory(
        disease="healthy",
        confidence=98.0,
        crop="Tomato",
        weather=mock_weather_wet
    )
    assert "Healthy" in res.disease
    assert res.severity == "low"
    assert res.weatherRisk == "LOW"
    # Should not prescribe disease spray/fungicide actions
    for action in res.immediateActions:
        assert "fungicide" not in action.lower()
        assert "pesticide" not in action.lower()


def test_low_confidence_handling(mock_weather_wet):
    """Test confidence below 60% yields low confidence warning without disease actions."""
    res = farm_intelligence_service.generate_advisory(
        disease="late_blight",
        confidence=45.0,  # Below 60%
        crop="Tomato",
        weather=mock_weather_wet
    )
    assert res.disease == "Uncertain Classification"
    assert res.severity == "low"
    assert "below 60%" in res.summary or "good daylight" in res.summary
    assert any("retake" in act.lower() for act in res.immediateActions)


def test_weather_unavailable_fallback():
    """Test weather=None returns weatherAvailable=False and no fake weather values."""
    res = farm_intelligence_service.generate_advisory(
        disease="early_blight",
        confidence=88.0,
        crop="Tomato",
        weather=None
    )
    assert res.disease == "Early Blight"
    assert res.weatherAvailable is False
    assert res.weatherSummary is None
    assert res.weatherRisk == "UNAVAILABLE"
    assert any("unavailable" in adv.lower() for adv in res.weatherAdvice)


def test_farm_intelligence_endpoint_e2e(client):
    """Test FastAPI POST /api/farm-intelligence and POST /api/intelligence/farm-analysis."""
    payload = {
        "disease": "late_blight",
        "crop": "Tomato",
        "confidence": 94.5,
        "city": "Vadodara"
    }

    # Test /api/farm-intelligence
    res1 = client.post("/api/farm-intelligence", json=payload)
    assert res1.status_code == 200
    data1 = res1.json()["data"]
    assert data1["disease"] == "Late Blight"
    assert data1["crop"] == "Tomato"
    assert data1["confidence"] == 94.5
    assert len(data1["immediateActions"]) >= 3

    # Test /api/intelligence/farm-analysis
    res2 = client.post("/api/intelligence/farm-analysis", json=payload)
    assert res2.status_code == 200
    data2 = res2.json()["data"]
    assert data2["disease"] == "Late Blight"
