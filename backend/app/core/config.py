from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "iQ1zlet"
    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool = False
    HASH_NAME: str = "sha256"
    HASH_ITERATIONS: int = 120000
    
    # Указываем, откуда брать данные
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Создаем один экземпляр настроек, который будем импортировать везде
settings = Settings()