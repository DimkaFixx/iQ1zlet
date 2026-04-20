from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base

class CardsModel(Base):
    __tablename__ = "cards_table"
    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("decks_table.id"))
    first_side = Column(String)
    second_side = Column(String)