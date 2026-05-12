from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "iQ1zlet"
    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool = False
    HASH_NAME: str = "sha256"
    HASH_ITERATIONS: int = 120000
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_SECRET: str
    
    # Указываем, откуда брать данные
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Создаем один экземпляр настроек, который будем импортировать везде
settings = Settings()