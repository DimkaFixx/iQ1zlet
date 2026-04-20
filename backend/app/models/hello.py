from sqlalchemy import Column, Integer, String
from app.db.session import Base

class HelloModel(Base):
    __tablename__ = "hello_table"

    id = Column(Integer, primary_key=True, index=True)
    hello = Column(String) # та самая колонка "hello"