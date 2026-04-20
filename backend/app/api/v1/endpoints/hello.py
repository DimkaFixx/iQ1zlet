from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.hello import HelloSchema
from app.crud.hello import get_hello_by_id

router = APIRouter()

@router.get("/", response_model=HelloSchema)
def read_hello(db: Session = Depends(get_db)):
    # Ищем элемент с ID 1
    db_hello = get_hello_by_id(db, hello_id=1)
    if db_hello is None:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    return db_hello