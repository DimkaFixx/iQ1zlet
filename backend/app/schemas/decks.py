from pydantic import BaseModel
from app.schemas.cards import CardSchema


class DeckSchema(BaseModel):
    name: str
    owner_nickname: str
    deck: list[CardSchema]

    class Config:
        from_attributes = True