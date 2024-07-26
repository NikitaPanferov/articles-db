from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Base


class Problem(Base):
    text: Mapped[str] = mapped_column(String(255), nullable=False)
    is_solved: Mapped[bool] = mapped_column(
        default=False, server_default="false", nullable=False
    )

    article_id: Mapped[int] = mapped_column(ForeignKey("articles.id"), nullable=False)
    article = relationship("Article", back_populates="problems")

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="problems")
