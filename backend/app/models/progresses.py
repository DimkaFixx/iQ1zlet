from sqlalchemy import Column, Integer, ForeignKey
from app.db.session import Base

class CardProgressesModel(Base):
    __tablename__ = "card_progresses_table"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    