from datetime import timedelta
import datetime
from typing import Annotated

from typing_extensions import Optional
import bcrypt
import jwt
from jwt.exceptions import PyJWTError
from fastapi import HTTPException, Depends, Security
from fastapi.security import APIKeyCookie
from starlette import status
from configs.config import settings
from models import db, User
from repositories.abc_repositories import AbstractUserRepository
from repositories.sqlalchemy.user_repository import UserRepository
from schemas.auth_schemas import AuthResponse, UserSchema


class UserService:
    def __init__(self, user_repo: AbstractUserRepository):
        self.user_repo = user_repo

    async def login_user(self, email: str, password: str) -> AuthResponse:
        unauth_exp = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

        user_from_db = await self.user_repo.get_user_by_email(email)

        if not user_from_db:
            raise unauth_exp

        if not self.verify_password(password, user_from_db.hashed_password):
            raise unauth_exp
        jwt_payload = {"sub": user_from_db.id, "email": user_from_db.email}

        access_token = self.encode_jwt(jwt_payload)
        refresh_token = self.encode_jwt(
            payload=jwt_payload,
            expire_minutes=settings.jwt.refresh_token_expire_minutes,
        )

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserSchema.model_validate(user_from_db),
        )

    async def create_user(self, email: str, name: str, password: str) -> AuthResponse:
        user_from_db = await self.user_repo.get_user_by_email(email)

        if user_from_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )

        hashed_password = self.hash_password(password)
        await self.user_repo.create_user(email, name, hashed_password)

        return await self.login_user(email, password)

    async def refresh_access_token(self, refresh_token: str) -> AuthResponse:
        user = await self.auth_user_by_token(refresh_token)

        payload = self.decode_jwt(refresh_token)

        if datetime.datetime.fromtimestamp(
            payload["exp"], datetime.UTC
        ) < datetime.datetime.now(datetime.UTC):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token is expired",
            )

        jwt_payload = {"sub": user.id, "email": user.email}

        access_token = self.encode_jwt(jwt_payload)
        refresh_token = self.encode_jwt(
            payload=jwt_payload,
            expire_minutes=settings.jwt.refresh_token_expire_minutes,
        )

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserSchema(id=user.id, email=user.email, name=user.name),
        )

    async def auth_user_by_token(self, token: str) -> Optional[User]:
        unauth_exp = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect token",
        )

        expired_token_exp = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired token",
        )
        try:
            decoded = self.decode_jwt(token)
        except PyJWTError:
            raise unauth_exp
        user_id = decoded.get("sub")

        if not user_id:
            raise unauth_exp

        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise unauth_exp

        expired_date = decoded.get("exp")
        if not expired_date:
            raise unauth_exp

        if datetime.datetime.fromtimestamp(
            expired_date, datetime.UTC
        ) < datetime.datetime.now(datetime.UTC):
            raise expired_token_exp

        return user

    @staticmethod
    def encode_jwt(
        payload: dict,
        private_key: Optional[str] = None,
        algorithm: Optional[str] = None,
        expire_minutes: Optional[int] = None,
        expire_timedelta: Optional[timedelta] = None,
    ):
        if not private_key:
            private_key = settings.jwt.private_key_path.read_text()

        if not algorithm:
            algorithm = settings.jwt.algorithm

        if not expire_minutes:
            expire_minutes = settings.jwt.access_token_expire_minutes

        to_encode = payload.copy()
        now = datetime.datetime.now(datetime.UTC)

        if expire_timedelta:
            expire = now + expire_timedelta
        else:
            expire = now + timedelta(minutes=expire_minutes)

        to_encode.update(exp=expire, iat=now)

        encoded = jwt.encode(to_encode, private_key, algorithm)

        return encoded

    @staticmethod
    def decode_jwt(
        token: str,
        public_key: Optional[str] = None,
        algorithm: Optional[str] = None,
    ):
        if not public_key:
            public_key = settings.jwt.public_key_path.read_text()

        if not algorithm:
            algorithm = settings.jwt.algorithm

        decoded = jwt.decode(token, public_key, algorithms=[algorithm])

        return decoded

    @staticmethod
    def hash_password(password: str) -> bytes:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode(), salt)

    @staticmethod
    def verify_password(password: str, hashed_password: bytes) -> bool:
        return bcrypt.checkpw(password.encode(), hashed_password)


def user_service():
    return UserService(UserRepository(db.session_factory))


auth_scheme = APIKeyCookie(name="access_token")


async def get_user(
    u_service: Annotated[UserService, Depends(user_service)],
    token: Annotated[str, Security(auth_scheme)],
):
    return await u_service.auth_user_by_token(token)


current_user = Annotated[User, Depends(get_user)]
