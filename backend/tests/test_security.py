from app.core.security import create_access_token, get_password_hash
from app.db.models.user import User


def test_cross_user_farm_access_forbidden(client, db):
    # Create second user in db
    other_user = User(
        id="user-002",
        full_name="Other Farmer",
        email="other.farmer@farmguard.ai",
        phone="+91 91111 22222",
        password_hash=get_password_hash("Password123"),
        location="Rajkot, Gujarat"
    )
    db.add(other_user)
    db.commit()

    other_user_token = create_access_token(subject="user-002")
    headers = {"Authorization": f"Bearer {other_user_token}"}

    # Attempt to view farm-1 owned by user-001
    response = client.get("/api/farms/farm-1", headers=headers)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "FORBIDDEN"



def test_invalid_jwt_token_rejected(client):
    invalid_headers = {"Authorization": "Bearer invalid.jwt.token.string"}
    response = client.get("/api/auth/me", headers=invalid_headers)
    assert response.status_code == 401
