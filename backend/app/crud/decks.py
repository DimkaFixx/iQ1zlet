from sqlalchemy.orm import Session
from app.models.decks import DeckModel
from app.models.users import UserModel

def get_all_decks(db: Session):
    return db.query(DeckModel).all()


def get_decks_by_user(db: Session, user_id: int):
    return db.query(DeckModel).filter(DeckModel.owner_id == user_id).all()


def create_deck(db: Session, name: str, owner_id: int, uid: str):
    deck = DeckModel(name=name, owner_id=owner_id, uid=uid)
    db.add(deck)
    db.commit()
    db.refresh(deck)
    return deck
