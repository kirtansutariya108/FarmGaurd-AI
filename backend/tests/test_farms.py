def test_list_farms(client, auth_headers):
    response = client.get("/api/farms", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1
    farm = data["data"][0]
    assert "name" in farm
    assert "soilMoisture" in farm
    assert "healthScore" in farm


def test_create_farm(client, auth_headers):
    new_farm_payload = {
        "name": "Narmada North Parcel",
        "location": "Bharuch, Gujarat",
        "areaAcres": 3.2,
        "crop": "Tomato",
        "cropVariety": "Abhinav F1",
        "soilType": "Loamy",
        "growthStage": "Flowering"
    }
    response = client.post("/api/farms", json=new_farm_payload, headers=auth_headers)
    assert response.status_code == 201
    created = response.json()["data"]
    assert created["name"] == "Narmada North Parcel"
    assert created["areaAcres"] == 3.2


def test_update_farm(client, auth_headers):
    update_payload = {
        "soilMoisture": 42.0,
        "lastIrrigationDaysAgo": 1
    }
    response = client.put("/api/farms/farm-1", json=update_payload, headers=auth_headers)
    assert response.status_code == 200
    updated = response.json()["data"]
    assert updated["soilMoisture"] == 42.0
    assert updated["lastIrrigationDaysAgo"] == 1
