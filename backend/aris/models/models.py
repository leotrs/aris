"""
models.py

This module defines the SQLAlchemy ORM models for the Aris platform, including users,
files, associated metadata such as tags, and private user-uploaded file assets (images,
data, code). Supports soft deletes.

All models use timezone-aware timestamps and cascade deletion where appropriate.

"""

import enum
from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()


class AvatarColor(enum.Enum):
    """Enum for user avatar color options.

    Attributes
    ----------
    BLUE, RED, GREEN, PURPLE, ORANGE, PINK, YELLOW : str
        Hex color codes used for avatars.

    """

    BLUE = "#0E9AE9"
    RED = "#EF4B4C"
    GREEN = "#1FB5A2"
    PURPLE = "#AD71F2"
    ORANGE = "#F5862B"
    PINK = "#EC4899"
    YELLOW = "#F5AB00"

    @classmethod
    def random(cls):
        """Return a random avatar color.

        Returns
        -------
        AvatarColor
            Randomly chosen enum value.

        """
        import random

        return random.choice(list(cls))


class User(Base):
    """Represents an application user who owns files, tags, and file assets.

    Attributes
    ----------
    id : int
        Primary key.
    name : str
        Full name of the user.
    email : str
        Unique email address.
    password_hash : str
        Hashed user password.
    initials : str
        Optional initials string.
    deleted_at : datetime
        Timestamp for soft deletes.
    created_at : datetime
        Time of account creation.
    last_login : datetime
        Last login timestamp.
    avatar_color : AvatarColor
        Selected avatar color.
    files : list of File
        Files owned by the user.
    tags : list of Tag
        Tags owned by the user.
    file_assets : list of FileAsset
        Private files attached to user files.

    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    initials = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    avatar_color = Column(Enum(AvatarColor), nullable=True, default=AvatarColor.BLUE)

    files = relationship("File", back_populates="owner")
    tags = relationship("Tag", back_populates="owner", cascade="all, delete-orphan")
    file_assets = relationship("FileAsset", back_populates="owner", cascade="all, delete-orphan")


file_tags = Table(
    "file_tags",
    Base.metadata,
    Column("file_id", Integer, ForeignKey("files.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class FileStatus(enum.Enum):
    """
    Enum representing the publication status of a research file.
    """

    DRAFT = "Draft"
    UNDER_REVIEW = "Under Review"
    PUBLISHED = "Published"


class File(Base):
    """
    Represents a research file with RSM source and associated metadata.

    Attributes
    ----------
    id : int
        Primary key.
    title : str
        Optional title.
    abstract : str
        Optional abstract.
    keywords : str
        Optional comma-separated keywords.
    status : FileStatus
        Draft, Under Review, or Published.
    last_edited_at : datetime
        Auto-updated on edit.
    created_at : datetime
        Timestamp of file creation.
    doi : str
        Optional unique DOI.
    source : str
        RSM source code.
    deleted_at : datetime
        Soft delete marker.
    owner_id : int
        Foreign key to User.
    owner : User
        Owner relationship.
    tags : list of Tag
        Tags associated with the file.
    file_assets : list of FileAsset
        Assets attached to the file.
    """

    __tablename__ = "files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=True)
    abstract = Column(Text, nullable=True)
    keywords = Column(String, nullable=True)
    status = Column(Enum(FileStatus), nullable=False, default=FileStatus.DRAFT)
    last_edited_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    doi = Column(String, unique=True, nullable=True)
    source = Column(Text, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="files")
    tags = relationship("Tag", secondary=file_tags, back_populates="files")
    file_assets = relationship("FileAsset", back_populates="file", cascade="all, delete-orphan")


class Tag(Base):
    """
    Represents a user-defined tag for organizing research files.

    Attributes
    ----------
    id : int
        Primary key.
    user_id : int
        Foreign key to User.
    name : str
        Tag name.
    color : str
        Display color.
    created_at : datetime
        Timestamp of creation.
    deleted_at : datetime
        Soft delete marker.
    files : list of File
        Files associated with this tag.
    owner : User
        Owner relationship.
    """

    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    files = relationship("File", secondary=file_tags, back_populates="tags")
    owner = relationship("User", back_populates="tags")


class FileAsset(Base):
    """
    Represents a private user-uploaded file associated with a File.

    Used for storing supporting assets such as images, data files, or text snippets.
    Visibility is restricted to the owning user.

    Attributes
    ----------
    id : int
        Primary key.
    filename : str
        Name of the file.
    mime_type : str
        MIME type (e.g., image/png).
    content : str
        File contents (stored inline).
    uploaded_at : datetime
        Timestamp of upload.
    deleted_at : datetime
        Soft delete marker.
    owner_id : int
        Foreign key to User.
    file_id : int
        Foreign key to File.
    owner : User
        Owner relationship.
    file : File
        File to which the asset is attached.
    """

    __tablename__ = "file_assets"
    __table_args__ = (
        UniqueConstraint("file_id", "filename", name="uq_file_asset_filename_per_file"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="file_assets")
    file = relationship("File", back_populates="file_assets")
