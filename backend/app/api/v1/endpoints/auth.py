from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.users import authenticate_user, create_user, get_user_by_identifier
from app.db.session import get_db
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserOut

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_identifier(db, payload.nickname):
        raise HTTPException(status_code=400, detail="Nickname already exists")
    if payload.email and get_user_by_identifier(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = create_user(db, nickname=payload.nickname, email=payload.email, password=payload.password)
    return AuthResponse(message="User registered", user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.identifier, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return AuthResponse(message="Login successful", user=UserOut.model_validate(user))