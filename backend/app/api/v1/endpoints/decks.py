from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.decks import get_all_decks, get_decks_by_user, create_deck
from app.schemas.decks_list import DeckItem, DeckCreateRequest
from app.models.users import UserModel
from app.core.security import get_current_user
from app.crud.users import get_user_by_identifier
import secrets

router = APIRouter()


@router.get("/", response_model=list[DeckItem])
def list_decks(db: Session = Depends(get_db)):
    decks = get_all_decks(db)
    result = []
    for d in decks:
        owner = db.query(UserModel).filter(UserModel.id == d.owner_id).first()
        result.append(DeckItem(id=d.id, name=d.name, uid=d.uid, owner_id=d.owner_id, owner_nickname=owner.nickname if owner else None))
    return result


@router.get("/me", response_model=list[DeckItem])
def my_decks(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    decks = get_decks_by_user(db, current_user.id)
    return [DeckItem(id=d.id, name=d.name, uid=d.uid, owner_id=d.owner_id, owner_nickname=current_user.nickname) for d in decks]


@router.post("/", response_model=DeckItem, status_code=status.HTTP_201_CREATED)
def create_new_deck(payload: DeckCreateRequest, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    uid = secrets.token_hex(8)
    deck = create_deck(db, payload.name, current_user.id, uid)
    return DeckItem(id=deck.id, name=deck.name, uid=deck.uid, owner_id=deck.owner_id, owner_nickname=current_user.nickname)
