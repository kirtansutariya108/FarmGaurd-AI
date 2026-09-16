def test_validate_leaf_image(client, auth_headers, sample_leaf_image_bytes):
    response = client.post(
        "/api/disease/validate",
        files={"file": ("leaf.jpg", sample_leaf_image_bytes, "image/jpeg")},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["isValid"] is True
    assert data["lightingQuality"] in ["Good", "Fair"]


def test_predict_disease_early_blight(client, auth_headers, sample_leaf_image_bytes):
    response = client.post(
        "/api/disease/predict",
        files={"file": ("leaf.jpg", sample_leaf_image_bytes, "image/jpeg")},
        data={"crop_name": "Tomato", "farm_id": "farm-1", "scenario": "earlyBlight"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["cropName"] == "Tomato"
    assert data["primaryCondition"] == "Early Blight"
    assert data["confidence"] > 80.0
    assert data["status"] == "Needs Attention"
    assert len(data["topPredictions"]) == 3


def test_predict_disease_uncertain_confidence(client, auth_headers, sample_leaf_image_bytes):
    response = client.post(
        "/api/disease/predict",
        files={"file": ("leaf.jpg", sample_leaf_image_bytes, "image/jpeg")},
        data={"crop_name": "Tomato", "farm_id": "farm-1", "scenario": "lowConfidence"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["status"] == "Uncertain"
    assert data["isLowConfidence"] is True


def test_reject_corrupted_file(client, auth_headers):
    corrupted_bytes = b"This is not a valid JPEG or PNG file"
    response = client.post(
        "/api/disease/predict",
        files={"file": ("fake.jpg", corrupted_bytes, "image/jpeg")},
        headers=auth_headers
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_IMAGE"
