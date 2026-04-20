from fastapi import APIRouter, Depends
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.crud.cards import get_cards
from app.schemas.decks import DeckSchema


router = APIRouter()

@router.get("/", response_model=DeckSchema)
def get_cards_for_deck(deck_uid: str, db: Session = Depends(get_db)):
    return get_cards(deck_uid, db)