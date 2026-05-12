from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.db.session import engine, Base, SessionLocal
from app.crud.users import create_mock_user
from app.crud.cards import create_mock_cards
from app.models.users import UserModel
from app.models.decks import DeckModel
from app.models.cards import CardsModel

# Создаем таблицы (пока не используем Alembic)
Base.metadata.create_all(bind=engine)

# Инициализируем тестовые данные
db = SessionLocal()
create_mock_user(db)
create_mock_cards(db)
db.close()

app = FastAPI(title="My Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")