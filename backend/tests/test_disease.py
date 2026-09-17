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


def test_predict_disease_real_model(client, auth_headers, sample_leaf_image_bytes):
    response = client.post(
        "/api/disease/predict",
        files={"file": ("leaf.jpg", sample_leaf_image_bytes, "image/jpeg")},
        data={"crop_name": "Tomato", "farm_id": "farm-1"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["cropName"] == "Tomato"
    assert data["primaryCondition"] is not None
    assert data["confidence"] > 0.0
    assert data["status"] in ["Needs Attention", "Healthy-looking", "Uncertain"]
    assert len(data["topPredictions"]) >= 1


def test_canonical_predict_endpoint(client, sample_leaf_image_bytes):
    response = client.post(
        "/api/predict",
        files={"file": ("leaf.jpg", sample_leaf_image_bytes, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "class_name" in data or "predicted_class" in data or "class" in data
    assert "confidence" in data
    assert data["confidence"] > 0.0


def test_reject_corrupted_file(client, auth_headers):
    corrupted_bytes = b"This is not a valid JPEG or PNG file"
    response = client.post(
        "/api/disease/predict",
        files={"file": ("fake.jpg", corrupted_bytes, "image/jpeg")},
        headers=auth_headers
    )
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "INVALID_IMAGE"


def test_unsupported_blank_image(client):
    import io
    from PIL import Image
    # Create pure black blank image
    img = Image.new("RGB", (224, 224), color=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    
    response = client.post(
        "/api/predict",
        files={"file": ("blank.jpg", buf.getvalue(), "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "unsupported_image"
    assert data["success"] is False
    assert "blank" in data["message"].lower() or "leaf" in data["message"].lower()


