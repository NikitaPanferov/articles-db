from typing_extensions import Optional
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from configs.config import settings


class DatabaseHelper:
    def __init__(self, url: Optional[str] = None, echo: Optional[bool] = None) -> None:
        if not url:
            url = str(settings.db.url)

        if not echo:
            echo = settings.db.echo

        self.engine = create_async_engine(url=url, echo=echo)
        self.session_factory = async_sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )

    async def dispose(self) -> None:
        await self.engine.dispose()


db = DatabaseHelper()
