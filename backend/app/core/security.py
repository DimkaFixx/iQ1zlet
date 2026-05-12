import hashlib
import hmac
import secrets

from app.core.config import settings
import jwt
from datetime import datetime, timedelta

from fastapi import Header, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.users import UserModel

def generate_salt() -> str:
	return secrets.token_hex(16)


def hash_password(password: str, salt: str) -> str:
	password_bytes = password.encode('utf-8')
	salt_bytes = salt.encode('utf-8')
	return hashlib.pbkdf2_hmac(settings.HASH_NAME, password_bytes, salt_bytes, settings.HASH_ITERATIONS).hex()


def verify_password(password: str, salt: str, hashed_password: str) -> bool:
	candidate = hash_password(password, salt)
	return hmac.compare_digest(candidate, hashed_password)


def create_access_token(subject: str | int, nickname: str = "", expires_delta: int | None = None) -> str:
	expire = datetime.utcnow() + (timedelta(minutes=expires_delta) if expires_delta else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
	to_encode = {"sub": str(subject), "nickname": nickname, "exp": expire}
	encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
	return encoded_jwt


def create_refresh_token(subject: str | int, expires_days: int | None = None) -> str:
	expire = datetime.utcnow() + (timedelta(days=expires_days) if expires_days else timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
	to_encode = {"sub": str(subject), "exp": expire}
	encoded_jwt = jwt.encode(to_encode, settings.REFRESH_SECRET, algorithm=settings.JWT_ALGORITHM)
	return encoded_jwt


def decode_token(token: str, secret: str = None) -> dict | None:
	secret = secret or settings.SECRET_KEY
	try:
		data = jwt.decode(token, secret, algorithms=[settings.JWT_ALGORITHM])
		return data
	except jwt.PyJWTError:
		return None

def get_current_user(authorization: str | None = Header(None), db: Session = Depends(get_db)) -> UserModel:
	if not authorization:
		raise HTTPException(status_code=401, detail="Missing Authorization header")
	scheme, _, token = authorization.partition(' ')
	if scheme.lower() != 'bearer' or not token:
		raise HTTPException(status_code=401, detail="Invalid authorization scheme")
	payload = decode_token(token)
	if not payload or 'sub' not in payload:
		raise HTTPException(status_code=401, detail="Invalid or expired token")
	user_id = int(payload['sub'])
	user = db.query(UserModel).filter(UserModel.id == user_id).first()
	if not user:
		raise HTTPException(status_code=401, detail="User not found")
	return user
