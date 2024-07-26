from sqlalchemy import String, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class User(Base):
    email: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[bytes] = mapped_column(LargeBinary)

    articles = relationship("Article", back_populates="user")
    problems = relationship("Problem", back_populates="user")