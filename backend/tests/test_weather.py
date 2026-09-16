def test_get_current_weather(client, auth_headers):
    response = client.get("/api/weather/current?farm_id=farm-1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "currentTemp" in data
    assert "humidity" in data
    assert "rainProbability" in data
    assert "forecast" in data
    assert len(data["forecast"]) >= 5


def test_refresh_forecast(client, auth_headers):
    response = client.get("/api/weather/forecast?farm_id=farm-1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "farmInsight" in data
