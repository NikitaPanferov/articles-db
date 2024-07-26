from typing import List, Union, Optional

from fastapi import HTTPException
from starlette import status

from models import db
from models.article import TermRuTypeEnum, TermEnTypeEnum, en_ru_term_mapper, LangEnum
from repositories.abc_repositories import AbstractArticleRepository
from repositories.sqlalchemy.article_repository import ArticleRepository
from schemas.articles_schemas import (
    ArticleSchema,
    ArticleShortSchema,
    ArticleWithProblemsSchema,
    ProblemSchema,
    ArticleWithProblemsRequestSchema,
)


class ArticleService:
    def __init__(self, article_repo: AbstractArticleRepository):
        self.article_repo = article_repo

    async def create_article(
        self, user_id: int, article: ArticleSchema
    ) -> ArticleShortSchema:
        if await self.article_repo.get_article_by_name(article.name) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f'Article with name "{article.name}" already exists',
            )

        if (
            await self.article_repo.get_article_by_identifier(article.identifier)
            is not None
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f'Article with identifier "{
                    article.identifier}" already exists',
            )

        new_article = await self.article_repo.create_article(
            **article.model_dump(), user_id=user_id
        )
        return ArticleShortSchema.model_validate(new_article)

    async def get_article_by_id(self, article_id: int) -> ArticleWithProblemsSchema:
        article = await self.article_repo.get_article_by_id(article_id)
        if article is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
            )
        return ArticleWithProblemsSchema.model_validate(article)

    async def get_articles_by_user_id(self, user_id: int) -> List[ArticleShortSchema]:
        return [
            ArticleShortSchema.model_validate(article)
            for article in await self.article_repo.get_all_articles_by_user_id(user_id)
        ]

    async def create_problem(
        self, user_id: int, article_id: int, problem_text: str
    ) -> ProblemSchema:
        article = await self.article_repo.get_article_by_id(article_id)
        if article is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
            )

        if article.user_id == user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to create problems for this article",
            )

        new_problem = await self.article_repo.create_problem(problem_text, article_id, user_id)

        return ProblemSchema.model_validate(new_problem)

    async def get_articles(
        self,
        term: Optional[Union[TermRuTypeEnum, TermEnTypeEnum]] = None,
        name: Optional[str] = None,
        author: Optional[str] = None,
        year: Optional[int] = None,
    ) -> List[ArticleShortSchema]:
        new_term = (
            term if isinstance(term, TermRuTypeEnum) else en_ru_term_mapper.get(term)
        )
        results = await self.article_repo.search(new_term, name, author, year)
        return [ArticleShortSchema.model_validate(article) for article in results]

    async def update_article_with_problems(
        self,
        user_id: int,
        article_id: int,
        article_with_problems: ArticleWithProblemsRequestSchema,
    ) -> Optional[ArticleWithProblemsSchema]:

        article = await self.article_repo.get_article_by_id(article_id)
        if article is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
            )

        if article.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to update this article",
            )

        existed_problems = {problem.id for problem in article.problems}
        for problem in article_with_problems.problems:
            if problem.id not in existed_problems:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Problem {
                        problem.id} for article {article_id} not found",
                )
            existed_problems.remove(problem.id)

        for problem in article.problems:
            if problem.id in existed_problems and not problem.is_solved:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Problem {problem.id} is not solved",
                )

        article_data = article_with_problems.model_dump()
        problems_data = article_data.get("problems", [])
        del article_data["problems"]
        updated_article = await self.article_repo.update_article_with_problems(
            article_id, article_data, problems_data
        )

        return ArticleWithProblemsSchema.model_validate(updated_article)

    @staticmethod
    async def get_terms_by_lang(lang: LangEnum) -> List[str]:
        if lang == LangEnum.ru:
            return list(TermRuTypeEnum)
        return list(TermEnTypeEnum)


def article_service():
    return ArticleService(ArticleRepository(db.session_factory))
