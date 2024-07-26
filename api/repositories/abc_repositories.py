from abc import ABC, abstractmethod
from typing import Optional, List, Dict

from models import User, Problem
from models.article import Article, LangEnum, TermEnTypeEnum, TermRuTypeEnum


class AbstractUserRepository(ABC):
    @abstractmethod
    async def create_user(
        self, email: str, name: str, hashed_password: bytes
    ) -> Optional[User]:
        pass

    @abstractmethod
    async def get_user_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        pass


class AbstractArticleRepository(ABC):
    @abstractmethod
    async def create_article(
        self,
        name: str,
        term: TermEnTypeEnum | TermRuTypeEnum,
        terminology: str,
        author: str,
        key_words: str,
        publication_year: int,
        url: str,
        identifier: str,
        usage_context: str,
        math_apparatus: str,
        solving: str,
        interests: str,
        user_id: int,
        lang: LangEnum,
    ) -> Optional[Article]:
        pass

    @abstractmethod
    async def get_article_by_id(self, article_id: int) -> Optional[Article]:
        pass

    @abstractmethod
    async def get_all_articles(self) -> List[Article]:
        pass

    @abstractmethod
    async def get_all_articles_by_user_id(self, user_id: int) -> List[Article]:
        pass

    @abstractmethod
    async def create_problem(
        self, problem_text: str, article_id: int, user_id: int
    ) -> Optional[Problem]:
        pass

    @abstractmethod
    async def get_article_by_name(self, article_name: str) -> Optional[Article]:
        pass

    @abstractmethod
    async def get_article_by_identifier(
        self, article_identifier: str
    ) -> Optional[Article]:
        pass

    @abstractmethod
    async def search(
        self,
        term: Optional[TermRuTypeEnum],
        name: Optional[str],
        author: Optional[str],
        year: Optional[int],
    ) -> List[Article]:
        pass

    @abstractmethod
    async def update_article_with_problems(
        self, article_id: int, article_data: Dict, problems_data: List[Dict]
    ) -> Optional[Article]:
        pass
