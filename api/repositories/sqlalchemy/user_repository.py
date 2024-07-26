from typing import Optional

from sqlalchemy import select

from models import User
from repositories.abc_repositories import AbstractUserRepository


class UserRepository(AbstractUserRepository):
    def __init__(self, db_session_factory):
        self.db_session_factory = db_session_factory

    async def create_user(
        self, email: str, name: str, hashed_password: bytes
    ) -> Optional[User]:
        async with self.db_session_factory() as session:
            async with session.begin():
                db_user = User(email=email, name=name, hashed_password=hashed_password)
                session.add(db_user)
                await session.commit()
            await session.refresh(db_user)
            return db_user

    async def get_user_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            return result.scalar_one_or_none()
