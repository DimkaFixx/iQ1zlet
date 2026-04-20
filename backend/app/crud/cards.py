from sqlalchemy.orm import Session
from app.models.decks import DeckModel
from app.models.cards import CardsModel
from app.models.users import UserModel
from app.schemas.decks import DeckSchema
from app.schemas.cards import CardSchema

def get_cards(deck_uid: str, db: Session):
    deck = db.query(DeckModel).filter(DeckModel.uid == deck_uid).first()
    if not deck:
        return None  # Или можно выбросить исключение, если колода не найдена
    cards = db.query(CardsModel).filter(CardsModel.deck_id == deck.id).all()
    owner_nickname = db.query(UserModel).filter(UserModel.id == deck.owner_id).first().nickname
    return DeckSchema(
        name=deck.name,
        owner_nickname=owner_nickname,
        deck=[CardSchema(first_side=card.first_side, second_side=card.second_side) for card in cards]
    )

def create_mock_cards(db: Session):
    # Создаем тестовую колоду, если ее еще нет
    if not db.query(DeckModel).filter(DeckModel.uid == "mock-deck-uid").first():
        mock_deck = DeckModel(name="Mock Deck", owner_id=1, uid="mock-deck-uid")
        db.add(mock_deck)
        db.commit()
        db.refresh(mock_deck)

        # Добавляем несколько карточек в эту колоду
        cards = [
            CardsModel(deck_id=mock_deck.id, first_side="Capital of France?", second_side="Paris"),
            CardsModel(deck_id=mock_deck.id, first_side="2 + 2?", second_side="4"),
            CardsModel(deck_id=mock_deck.id, first_side="Largest planet?", second_side="Jupiter"),
        ]
        db.add_all(cards)
        db.commit()