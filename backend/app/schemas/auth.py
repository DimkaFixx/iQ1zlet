from datetime import datetime
from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: int
    nickname: str
    email: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class RegisterRequest(BaseModel):
    nickname: str = Field(min_length=2, max_length=50)
    email: str | None = None
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=1, max_length=128)


class AuthResponse(BaseModel):
    message: str
    user: UserOut
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str | None = None


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"