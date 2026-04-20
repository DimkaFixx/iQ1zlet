from pydantic import BaseModel

class HelloSchema(BaseModel):
    id: int
    hello: str

    class Config:
        from_attributes = True