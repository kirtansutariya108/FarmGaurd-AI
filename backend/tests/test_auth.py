def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"identifier": "kirtan.farmer@farmguard.ai", "password": "FarmGuard@2026"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "access_token" in data["data"]
    assert data["data"]["user"]["email"] == "kirtan.farmer@farmguard.ai"


def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"identifier": "kirtan.farmer@farmguard.ai", "password": "WrongPassword123"}
    )
    assert response.status_code == 401
    assert "error" in response.json()


def test_register_new_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "fullName": "Pooja Patel",
            "email": "pooja.patel@farmguard.ai",
            "phone": "+91 99887 76655",
            "password": "SecurePassword123",
            "location": "Surat, Gujarat",
            "farmName": "Tapi Green Acres"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["data"]["user"]["email"] == "pooja.patel@farmguard.ai"


def test_get_current_user_me(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["fullName"] == "Kirtan Sutariya"
