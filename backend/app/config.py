from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://mentaltech:mentaltech_secret@db:5432/mentaltech"
    SECRET_KEY: str
    CORS_ORIGINS: str = "http://localhost:3033,http://localhost:5173"
    FRONTEND_URL: str = "http://localhost:3033"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Email settings
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@mentaltechmaker.fr"
    MAIL_FROM_NAME: str = "MentalTech Discover"
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
