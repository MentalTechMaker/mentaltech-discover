import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, StaticPool
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.rate_limit import limiter


SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    limiter.enabled = False
    yield
    limiter.enabled = True
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def registered_user(client):
    """Register a user and return the response data + credentials."""
    creds = {
        "email": "test@example.com",
        "password": "TestPass1",
        "name": "Test User",
    }
    res = client.post("/api/auth/register", json=creds)
    return {"response": res, "credentials": creds}


@pytest.fixture()
def auth_headers(registered_user):
    """Return Authorization headers for the registered user."""
    data = registered_user["response"].json()
    return {"Authorization": f"Bearer {data['access_token']}"}


@pytest.fixture()
def admin_user(client, db):
    """Register a user and promote to admin. Return auth headers."""
    from app.models.user import User

    creds = {
        "email": "admin@example.com",
        "password": "AdminPass1",
        "name": "Admin User",
    }
    res = client.post("/api/auth/register", json=creds)
    data = res.json()

    user = db.query(User).filter(User.email == "admin@example.com").first()
    user.role = "admin"
    db.commit()

    return {"Authorization": f"Bearer {data['access_token']}"}
