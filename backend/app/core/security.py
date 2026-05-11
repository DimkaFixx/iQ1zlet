import hashlib
import hmac
import secrets

from app.core.config import settings


def generate_salt() -> str:
	return secrets.token_hex(16)


def hash_password(password: str, salt: str) -> str:
	password_bytes = password.encode('utf-8')
	salt_bytes = salt.encode('utf-8')
	return hashlib.pbkdf2_hmac(settings.HASH_NAME, password_bytes, salt_bytes, settings.HASH_ITERATIONS).hex()


def verify_password(password: str, salt: str, hashed_password: str) -> bool:
	candidate = hash_password(password, salt)
	return hmac.compare_digest(candidate, hashed_password)
