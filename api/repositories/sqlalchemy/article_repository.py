from typing import Optional, List, Union, Dict

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from models import Article, Problem
from models.article import LangEnum, TermRuTypeEnum, TermEnTypeEnum
from repositories.abc_repositories import AbstractArticleRepository


class ArticleRepository(AbstractArticleRepository):
    def __init__(self, db_session_factory):
        self.db_session_factory = db_session_factory

    async def create_article(
        self,
        name: str,
        term: Union[TermRuTypeEnum, TermEnTypeEnum],
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
        article = Article(
            name=name,
            terminology=terminology,
            author=author,
            key_words=key_words,
            publication_year=publication_year,
            url=url,
            identifier=identifier,
            usage_context=usage_context,
            math_apparatus=math_apparatus,
            solving=solving,
            interests=interests,
            user_id=user_id,
            lang=lang,
        )
        article.term = term

        async with self.db_session_factory() as session:
            session.add(article)
            await session.commit()
            await session.refresh(article)
            return article

    async def get_article_by_id(self, article_id: int) -> Optional[Article]:
        stmt = (
            select(Article)
            .where(Article.id == article_id)
            .options(joinedload(Article.problems))
        )
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            article = result.unique().scalar_one_or_none()
            return article

    async def get_article_by_name(
        self,
        article_name: str,
    ) -> Optional[Article]:
        stmt = select(Article).where(Article.name == article_name)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            article = result.scalar_one_or_none()
            return article

    async def get_article_by_identifier(
        self, article_identifier: str
    ) -> Optional[Article]:
        stmt = select(Article).where(Article.identifier == article_identifier)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            article = result.scalar_one_or_none()
            return article

    async def get_all_articles(self) -> List[Article]:
        stmt = select(Article)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            articles = result.scalars().all()
            return articles

    async def get_all_articles_by_user_id(self, user_id: int) -> List[Article]:
        stmt = select(Article).where(Article.user_id == user_id)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            articles = result.scalars().all()
            return articles

    async def create_problem(
        self, problem_text: str, article_id: int, user_id: int
    ) -> Optional[Problem]:
        problem = Problem(text=problem_text, article_id=article_id, user_id=user_id)

        async with self.db_session_factory() as session:
            session.add(problem)
            await session.commit()
            await session.refresh(problem)
            return problem

    async def get_all_problems(self) -> List[Problem]:
        stmt = select(Problem)
        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            problems = result.scalars().all()
            return problems

    async def update_article_with_problems(
        self, article_id: int, article_data: Dict, problems_data: List[Dict]
    ) -> Optional[Article]:
        async with self.db_session_factory() as session:
            async with session.begin():
                for problem in problems_data:
                    await self.__update_problem(session, **problem)

                await self.__update_article(
                    session,
                    **article_data,
                    id=article_id,
                )

        return await self.get_article_by_id(article_id)

    @staticmethod
    async def __update_problem(
        session: AsyncSession, id: int, is_solved: bool
    ) -> Optional[Problem]:
        result = await session.execute(select(Problem).where(Problem.id == id))
        problem = result.scalar_one_or_none()

        if problem is None:
            return

        problem.is_solved = is_solved
        await session.flush()

    @staticmethod
    async def __update_article(
        session: AsyncSession,
        id: int,
        name: str,
        term: Union[TermRuTypeEnum, TermEnTypeEnum],
        terminology: str,
        author: str,
        key_words: str,
        url: str,
        identifier: str,
        usage_context: str,
        math_apparatus: str,
        solving: str,
        interests: str,
    ) -> Optional[Article]:
        article = (
            await session.execute(select(Article).where(Article.id == id))
        ).scalar_one_or_none()

        if article is None:
            return None

        article.name = name
        article.term = term
        article.terminology = terminology
        article.author = author
        article.key_words = key_words
        article.url = url
        article.identifier = identifier
        article.usage_context = usage_context
        article.math_apparatus = math_apparatus
        article.solving = solving
        article.interests = interests

        await session.flush()

    async def search(
        self,
        term: Optional[TermRuTypeEnum],
        name: Optional[str],
        author: Optional[str],
        year: Optional[int],
    ) -> List[Article]:
        stmt = select(Article)

        if term is not None:
            stmt = stmt.where(Article._term == term)

        if name is not None:
            stmt = stmt.where(Article.name.like(f"%{name}%"))

        if author is not None:
            stmt = stmt.where(Article.author.like(f"%{author}%"))

        if year is not None:
            stmt = stmt.where(Article.publication_year == year)

        async with self.db_session_factory() as session:
            result = await session.execute(stmt)
            articles = result.scalars().all()
            return articles
