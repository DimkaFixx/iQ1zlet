from pydantic import BaseModel


class CardSchema(BaseModel):
    first_side: str
    second_side: str

    class Config:
        from_attributes = True
