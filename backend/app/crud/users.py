from sqlalchemy.orm import Session
from app.core.security import generate_salt, hash_password, verify_password
from app.models.users import UserModel

def get_all_users(db: Session):
    return db.query(UserModel).all()


def get_user_by_identifier(db: Session, identifier: str):
    return (
        db.query(UserModel)
        .filter((UserModel.nickname == identifier) | (UserModel.email == identifier))
        .first()
    )


def create_user(db: Session, nickname: str, password: str, email: str | None = None):
    salt = generate_salt()
    hashed_password = hash_password(password, salt)
    db_user = UserModel(nickname=nickname, email=email, hashed_password=hashed_password, salt=salt)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, identifier: str, password: str):
    user = get_user_by_identifier(db, identifier)
    if user is None or not user.hashed_password or not user.salt:
        return None
    if not verify_password(password, user.salt, user.hashed_password):
        return None
    return user

# !!!!!
def create_mock_user(db: Session):
    if not db.query(UserModel).filter(UserModel.id == 1).first():
        db_user = UserModel(id=1, nickname="Mock User", hashed_password="", salt="")
        db.add(db_user)
        db.commit()