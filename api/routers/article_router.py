from typing import Annotated, List, Optional, Union

from fastapi import APIRouter, Depends
from starlette import status

from models.article import TermRuTypeEnum, TermEnTypeEnum, LangEnum
from schemas.articles_schemas import (
    ArticleShortSchema,
    ArticleSchema,
    ArticleWithProblemsSchema,
    ProblemSchema,
    ArticleWithProblemsRequestSchema, ArticleResponseSchema, NewProblemRequestSchema,
)
from services.article_service import ArticleService, article_service
from services.user_service import current_user

router = APIRouter(
    prefix="/api/articles",
    tags=["article"],
)


# @router.get('/')
# async def articles(
#         user: current_user,
#         articles_service: Annotated[ArticleService, Depends(article_service)]
# ) -> List[ArticleShortSchema]:
#     return await articles_service.get_articles()


@router.get("/my/")
async def my_articles(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
) -> List[ArticleShortSchema]:
    return await articles_service.get_articles_by_user_id(user.id)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_article(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    article: ArticleSchema,
) -> ArticleResponseSchema:
    new_short_article = await articles_service.create_article(user.id, article)
    return ArticleResponseSchema(id=new_short_article.id)


@router.get("/")
async def get_articles_with_search(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    term: Optional[Union[TermRuTypeEnum, TermEnTypeEnum]] = None,
    name: Optional[str] = None,
    author: Optional[str] = None,
    year: Optional[int] = None,
) -> List[ArticleShortSchema]:
    return await articles_service.get_articles(term, name, author, year)


@router.get("/{article_id}/", response_model=ArticleWithProblemsSchema)
async def article_by_id(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    article_id: int,
):
    return await articles_service.get_article_by_id(article_id)


@router.post("/{article_id}/")
async def create_problem(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    article_id: int,
    body: NewProblemRequestSchema,
) -> ProblemSchema:
    return await articles_service.create_problem(user.id, article_id, body.problem)


@router.put("/{article_id}/", response_model=ArticleWithProblemsSchema)
async def update_article(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    article_id: int,
    article: ArticleWithProblemsRequestSchema,
):
    return await articles_service.update_article_with_problems(
        user.id, article_id, article
    )


@router.get('/terms')
async def get_terms_by_lang(
    user: current_user,
    articles_service: Annotated[ArticleService, Depends(article_service)],
    lang: LangEnum,
) -> List[str]:
    return await articles_service.get_terms_by_lang(lang)

