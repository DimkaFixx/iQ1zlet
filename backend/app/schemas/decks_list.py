from pydantic import BaseModel


class DeckItem(BaseModel):
    id: int
    name: str
    uid: str
    owner_id: int
    owner_nickname: str | None = None

    class Config:
        from_attributes = True


class DeckCreateRequest(BaseModel):
    name: str
