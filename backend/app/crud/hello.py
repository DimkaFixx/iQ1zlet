from sqlalchemy.orm import Session
from app.models.hello import HelloModel

def get_hello_by_id(db: Session, hello_id: int):
    return db.query(HelloModel).filter(HelloModel.id == hello_id).first()

# Вспомогательная функция, чтобы нам было что выводить (создаем запись, если пусто)
def create_initial_hello(db: Session):
    if not db.query(HelloModel).filter(HelloModel.id == 1).first():
        db_hello = HelloModel(id=1, hello="Привет из базы данных!")
        db.add(db_hello)
        db.commit()