import datetime
from enum import Enum

from sqlalchemy import String, UniqueConstraint, ForeignKey, DateTime, func
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Base


class TermEnTypeEnum(str, Enum):
    digital_transformation = "Digital transformation"
    transfer_of_digital_technology = "Transfer of digital technology"
    digital_technology = "Digital technology"
    end_to_end_digital_technology = "End-to-end digital technology"
    breakthrough_technology = "Breakthrough technology"
    near_future_technology = "Near future technology"
    gradually_introduced_technology = "Gradually introduced technology"


class TermRuTypeEnum(str, Enum):
    digital_transformation = "Цифровая трансформация"
    transfer_of_digital_technology = "Трансфер цифровой технологии"
    digital_technology = "Цифровая технология"
    end_to_end_digital_technology = "Сквозная цифровая технология"
    breakthrough_technology = "Прорывная технология"
    near_future_technology = "Технология ближайшего будущего"
    gradually_introduced_technology = "Постепенно внедряемая технология"


term_type_enum = SQLAlchemyEnum(TermRuTypeEnum)

en_ru_term_mapper = {en: ru for en, ru in zip(TermEnTypeEnum, TermRuTypeEnum)}

ru_en_term_mapper = {ru: en for en, ru in zip(TermEnTypeEnum, TermRuTypeEnum)}


class LangEnum(str, Enum):
    ru = "ru"
    en = "en"


lang_enum = SQLAlchemyEnum(LangEnum)


class Article(Base):
    name: Mapped[str] = mapped_column(String(1023), nullable=False)
    _term: Mapped[TermRuTypeEnum] = mapped_column(
        "term", term_type_enum, nullable=False
    )
    terminology: Mapped[str] = mapped_column(String(1023), nullable=False)
    author: Mapped[str] = mapped_column(String(1023), nullable=False)
    key_words: Mapped[str] = mapped_column(String(1023), nullable=False)
    publication_year: Mapped[int] = mapped_column(nullable=False)
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    identifier: Mapped[str] = mapped_column(String(255), nullable=False)
    usage_context: Mapped[str] = mapped_column(String(1023), nullable=False)
    math_apparatus: Mapped[str] = mapped_column(String(1023), nullable=False)
    solving: Mapped[str] = mapped_column(String(1023), nullable=False)
    interests: Mapped[str] = mapped_column(String(1023), nullable=False)
    lang: Mapped[LangEnum] = mapped_column(lang_enum, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    problems = relationship("Problem", back_populates="article")

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False
    )  # Добавляем внешний ключ
    user = relationship("User", back_populates="articles")

    __table_args__ = (
        UniqueConstraint("name", name="_name_uc"),
        UniqueConstraint("identifier", name="_identifier_uc"),
    )

    @property
    def term(self):
        if self.lang == LangEnum.en and self._term:
            return ru_en_term_mapper.get(self._term, self._term)
        return self._term

    @term.setter
    def term(self, value):
        if isinstance(value, TermEnTypeEnum):
            self._term = en_ru_term_mapper.get(value)
        elif isinstance(value, TermRuTypeEnum):
            self._term = value
        else:
            raise ValueError("Invalid term value")
