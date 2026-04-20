from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base

class DeckModel(Base):
    __tablename__ = "decks_table"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users_table.id"))
    uid = Column(String, unique=True)