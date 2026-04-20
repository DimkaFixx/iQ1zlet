from sqlalchemy.orm import Session
from app.models.users import UserModel

def get_all_users(db: Session):
    return db.query(UserModel).all()

# !!!!!
def create_mock_user(db: Session):
    if not db.query(UserModel).filter(UserModel.id == 1).first():
        db_user = UserModel(id=1, nickname="Mock User")
        db.add(db_user)
        db.commit()