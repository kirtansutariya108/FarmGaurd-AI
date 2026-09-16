def test_dashboard_aggregation_endpoint(client, auth_headers):
    response = client.get("/api/dashboard?farm_id=farm-1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "farm" in data
    assert "weather" in data
    assert "cropHealth" in data
    assert "irrigation" in data
    assert "recentActivity" in data
    assert "recommendations" in data
    assert "farmInsight" in data
