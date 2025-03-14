import enum
from datetime import datetime

from sqlalchemy import (Column, DateTime, Enum, ForeignKey, Integer, String,
                        Text, create_engine)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()


class DocumentStatus(enum.Enum):
    DRAFT = "Draft"
    UNDER_REVIEW = "Under Review"
    PUBLISHED = "Published"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    documents = relationship("Document", backref="owner")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=True)
    abstract = Column(Text, nullable=True)
    keywords = Column(String, nullable=True)  # comma-separated
    status = Column(Enum(DocumentStatus), nullable=False, default=DocumentStatus.DRAFT)
    last_edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    doi = Column(String, unique=True, nullable=True)
    content = Column(Text, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # authors = relationship('Author', backref='document')
