from fastapi import APIRouter
from app.api.v1.endpoints import cards
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import decks

api_router = APIRouter()
api_router.include_router(cards.router, prefix="/cards/{deck_uid}", tags=["cards"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(decks.router, prefix="/decks", tags=["decks"])