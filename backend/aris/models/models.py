import enum
from datetime import datetime

from sqlalchemy import (Column, DateTime, Enum, ForeignKey, Integer, String,
                        Table, Text, UniqueConstraint, create_engine)
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
    tags = relationship("Tag", back_populates="owner", cascade="all, delete-orphan")


document_tags = Table(
    "document_tags",
    Base.metadata,
    Column(
        "document_id",
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    ),
)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=True)
    abstract = Column(Text, nullable=True)
    keywords = Column(String, nullable=True)  # comma-separated
    status = Column(Enum(DocumentStatus), nullable=False, default=DocumentStatus.DRAFT)
    last_edited_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    doi = Column(String, unique=True, nullable=True)
    source = Column(Text, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    tags = relationship("Tag", secondary=document_tags, back_populates="documents")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String, nullable=False, unique=False)
    color = Column(String, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    documents = relationship("Document", secondary=document_tags, back_populates="tags")
    owner = relationship("User", back_populates="tags")
