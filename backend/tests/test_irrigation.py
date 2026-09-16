def test_irrigation_recommendation_flow(client, auth_headers):
    response = client.post("/api/irrigation/recommend?farmId=farm-1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "status" in data
    assert "priority" in data
    assert "reasons" in data
    assert len(data["reasons"]) >= 1


def test_update_field_conditions(client, auth_headers):
    response = client.put(
        "/api/irrigation/conditions",
        json={
            "farmId": "farm-1",
            "soilMoisture": 26.0,
            "lastIrrigationDaysAgo": 3
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["status"] == "Recommended"
    assert data["priority"] == "High"
    assert data["fieldSignals"]["soilMoisture"] == 26.0
