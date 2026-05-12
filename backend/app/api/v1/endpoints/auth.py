from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.crud.users import authenticate_user, create_user, get_user_by_identifier
from app.db.session import get_db
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserOut
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.models.users import UserModel
import jwt
from datetime import datetime, timedelta
from fastapi import Body
from app.schemas.auth import RefreshRequest, RefreshResponse

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    if get_user_by_identifier(db, payload.nickname):
        raise HTTPException(status_code=400, detail="Nickname already exists")
    if payload.email and get_user_by_identifier(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = create_user(db, nickname=payload.nickname, email=payload.email, password=payload.password)
    token = create_access_token(user.id, nickname=user.nickname)
    refresh = create_refresh_token(user.id)
    
    # Set cookies with explicit domain for cross-origin
    response.set_cookie(key="access_token", value=token, max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, httponly=False, samesite="none", secure=False, domain="localhost", path="/")
    response.set_cookie(key="refresh_token", value=refresh, max_age=7*24*60*60, httponly=False, samesite="none", secure=False, domain="localhost", path="/")
    
    return AuthResponse(message="User registered", user=UserOut.model_validate(user), access_token=token, refresh_token=refresh, token_type="bearer")


@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.identifier, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(user.id, nickname=user.nickname)
    refresh = create_refresh_token(user.id)
    
    # Set cookies with explicit domain for cross-origin
    response.set_cookie(key="access_token", value=token, max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, httponly=False, samesite="none", secure=False, domain="localhost", path="/")
    response.set_cookie(key="refresh_token", value=refresh, max_age=7*24*60*60, httponly=False, samesite="none", secure=False, domain="localhost", path="/")
    
    return AuthResponse(message="Login successful", user=UserOut.model_validate(user), access_token=token, refresh_token=refresh, token_type="bearer")


@router.post("/refresh", response_model=RefreshResponse)
def refresh_token(body: RefreshRequest, response: Response, db: Session = Depends(get_db)):
    data = decode_token(body.refresh_token, secret=settings.REFRESH_SECRET)
    if not data or 'sub' not in data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = int(data['sub'])
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    # create new access token with nickname
    new_access = create_access_token(user_id, nickname=user.nickname)
    
    # Set cookie for new access token with explicit domain for cross-origin
    response.set_cookie(key="access_token", value=new_access, max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60, httponly=False, samesite="none", secure=False, domain="localhost", path="/")
    
    return RefreshResponse(access_token=new_access)