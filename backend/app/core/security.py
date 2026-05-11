import hashlib
import hmac
import secrets

_HASH_NAME = 'sha256'
_ITERATIONS = 120_000


def generate_salt() -> str:
	return secrets.token_hex(16)


def hash_password(password: str, salt: str) -> str:
	password_bytes = password.encode('utf-8')
	salt_bytes = salt.encode('utf-8')
	return hashlib.pbkdf2_hmac(_HASH_NAME, password_bytes, salt_bytes, _ITERATIONS).hex()


def verify_password(password: str, salt: str, hashed_password: str) -> bool:
	candidate = hash_password(password, salt)
	return hmac.compare_digest(candidate, hashed_password)
