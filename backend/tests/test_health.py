def test_get_crop_health(client, auth_headers):
    response = client.get("/api/health/farm-1", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "score" in data
    assert "status" in data
    assert "metrics" in data
    assert len(data["metrics"]) == 4
    assert 0 <= data["score"] <= 100
