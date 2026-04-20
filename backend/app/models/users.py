from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone, timedelta
from app.db.session import Base

def get_utc_plus_3():
    return datetime.now(timezone(timedelta(hours=3))) 

class UserModel(Base):
    __tablename__ = "users_table"
    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, unique=True, index=True)
    email = Column(String, nullable=True, unique=True, index=True)
    hashed_password = Column(String)
    salt = Column(String)
    created_at = Column(DateTime, default=get_utc_plus_3)