import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PlacementOS AI Microservice"
    VERSION: str = "1.0.0"
    PORT: int = 8000
    AI_SERVICE_SECRET: str = "internal_service_token_placementos_dev"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")  # mock | gemini | openai
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
