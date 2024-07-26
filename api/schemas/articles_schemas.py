from typing import List, Union

from pydantic import BaseModel, ConfigDict

from models.article import TermEnTypeEnum, TermRuTypeEnum, LangEnum


class ArticleShortSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    lang: LangEnum
    url: str
    user_id: int


class ArticleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    term: Union[TermRuTypeEnum, TermEnTypeEnum]
    terminology: str
    author: str
    key_words: str
    publication_year: int
    url: str
    identifier: str
    usage_context: str
    math_apparatus: str
    solving: str
    interests: str
    lang: LangEnum


class ProblemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    is_solved: bool


class ArticleWithProblemsSchema(ArticleSchema):
    id: int
    user_id: int
    problems: List[ProblemSchema]


class ProblemRequestSchema(BaseModel):
    id: int
    is_solved: bool


class ArticleWithProblemsRequestSchema(BaseModel):
    name: str
    term: Union[TermRuTypeEnum, TermEnTypeEnum]
    terminology: str
    author: str
    key_words: str
    url: str
    identifier: str
    usage_context: str
    math_apparatus: str
    solving: str
    interests: str

    problems: List[ProblemRequestSchema]


class ArticleResponseSchema(BaseModel):
    id: int


class NewProblemRequestSchema(BaseModel):
    problem: str
