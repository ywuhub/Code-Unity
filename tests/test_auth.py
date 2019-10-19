from werkzeug.datastructures import Headers
from server import app

client = app.test_client()


def headers_from_token(token: str):
    headers = Headers()
    headers.add("Authorization", f"Bearer {token}")
    return headers


def test_post_auth():
    """
    WARNING: This test runs on the production database.
    """
    response = client.post(
        "/api/auth", json={"username": "testuser", "password": "test"}
    )
    assert response.status_code is 200
    token = response.json["token"]
    # Test against a protected endpoint
    response = client.get("/api/user/profile", headers=headers_from_token(token))
    assert response.status_code is 200
    # Test wrong password
    response = client.post(
        "/api/auth", json={"username": "testuser", "password": "wrong"}
    )
    assert response.status_code is 401
