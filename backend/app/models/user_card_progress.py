from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base

class UserCardProgressModel(Base):
    __tablename__ = "user_card_progress_table"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_table.id"))
    deck_id = Column(Integer, ForeignKey("decks_table.id"))
    card_id = Column(Integer, ForeignKey("cards_table.id"))
    progress = Column(Integer, ForeignKey("card_progresses_table.id"))
    