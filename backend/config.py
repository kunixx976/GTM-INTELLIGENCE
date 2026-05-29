"""
ShadowRep AI — Backend Configuration
Loads settings from .env with sensible defaults for hackathon use.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # AI Provider
    GEMINI_API_KEY: str = ""

    # Notifications
    SLACK_WEBHOOK_URL: str = ""

    # Database
    DATABASE_URL: str = "./shadowrep.db"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Agent Scheduler
    AGENT_TICK_INTERVAL: int = 5

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def has_gemini_key(self) -> bool:
        return bool(self.GEMINI_API_KEY)

    @property
    def has_slack_webhook(self) -> bool:
        return bool(self.SLACK_WEBHOOK_URL)

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
