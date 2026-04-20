from fastapi import APIRouter
from app.api.v1.endpoints import hello
from app.api.v1.endpoints import cards

api_router = APIRouter()
api_router.include_router(hello.router, prefix="/hello", tags=["hello"])
api_router.include_router(cards.router, prefix="/cards/{deck_uid}", tags=["cards"])