"""All Aris database models.

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
    Index,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


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
    profile_picture_id : int
        Foreign key to ProfilePicture (optional).
    files : list of File
        Files owned by the user.
    tags : list of Tag
        Tags owned by the user.
    file_assets : list of FileAsset
        Private files attached to user files.
    profile_picture : ProfilePicture
        User's profile picture.

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
    avatar_color: Column[AvatarColor] = Column(Enum(AvatarColor), nullable=True, default=AvatarColor.BLUE)
    profile_picture_id = Column(Integer, ForeignKey("profile_pictures.id"), nullable=True)

    files = relationship("File", back_populates="owner")
    tags = relationship("Tag", back_populates="owner", cascade="all, delete-orphan")
    file_settings = relationship(
        "FileSettings", back_populates="user", cascade="all, delete-orphan"
    )
    file_assets = relationship("FileAsset", back_populates="owner", cascade="all, delete-orphan")
    profile_picture = relationship("ProfilePicture", back_populates="user")
    annotation_messages = relationship(
        "AnnotationMessage", back_populates="owner", cascade="all, delete-orphan"
    )


class ProfilePicture(Base):
    """A user's profile picture.

    Stores profile picture data with support for multiple image formats.
    Only one profile picture per user is active at a time.

    Attributes
    ----------
    id : int
        Primary key.
    filename : str
        Original filename of the uploaded image.
    mime_type : str
        MIME type (e.g., image/jpeg, image/png).
    content : str
        Base64-encoded image content.
    uploaded_at : datetime
        Timestamp of upload.
    deleted_at : datetime
        Soft delete marker.
    user : User
        User who owns this profile picture.

    """

    __tablename__ = "profile_pictures"

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="profile_picture")


file_tags = Table(
    "file_tags",
    Base.metadata,
    Column("file_id", Integer, ForeignKey("files.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class FileStatus(enum.Enum):
    """Enum representing the publication status of a research file."""

    DRAFT = "Draft"
    UNDER_REVIEW = "Under Review"
    PUBLISHED = "Published"


class File(Base):
    """A research file with RSM source and associated metadata.

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
    status: Column[FileStatus] = Column(Enum(FileStatus, name="filestatus"), nullable=False, default=FileStatus.DRAFT)
    last_edited_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    doi = Column(String, unique=True, nullable=True)
    source = Column(Text, nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="files")
    tags = relationship("Tag", secondary=file_tags, back_populates="files")
    annotations = relationship("Annotation", back_populates="file", cascade="all, delete-orphan")
    file_assets = relationship("FileAsset", back_populates="file", cascade="all, delete-orphan")
    file_settings = relationship(
        "FileSettings", back_populates="file", cascade="all, delete-orphan"
    )


class Tag(Base):
    """A user-defined tag for organizing research files.

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
    """A private user-uploaded file associated with a File.

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


class FileSettings(Base):
    """User-specific per-file display settings and default settings.

    Stores personalized display preferences (background, font, layout) that users can
    configure per file. Each user can have unique display settings for each file.
    When file_id is NULL, the record represents the user's default settings that
    are applied to new files as starting configuration.

    Attributes
    ----------
    id : int
        Primary key.
    file_id : int, optional
        Foreign key to File. NULL for default user settings.
    user_id : int
        Foreign key to User (owner of the settings).
    background : str
        CSS background value (color, variable, etc.).
    font_size : str
        Font size with units (e.g., "16px").
    line_height : str
        Line height value (unitless or with units).
    font_family : str
        Font family name or stack.
    margin_width : str
        Margin width with units (e.g., "16px").
    columns : int
        Number of display columns.
    created_at : datetime
        Timestamp of settings creation.
    updated_at : datetime
        Timestamp of last update.
    deleted_at : datetime
        Soft delete marker.
    file : File, optional
        File relationship. None for default settings.
    user : User
        User relationship.

    """

    __tablename__ = "file_settings"
    __table_args__ = (
        UniqueConstraint("file_id", "user_id", name="uq_file_settings_per_user_file"),
        Index(
            "ix_unique_default_settings_per_user",
            "user_id",
            unique=True,
            postgresql_where=text("file_id IS NULL"),
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    background = Column(String, nullable=False, default="var(--surface-page)")
    font_size = Column(String, nullable=False, default="16px")
    line_height = Column(String, nullable=False, default="1.5")
    font_family = Column(String, nullable=False, default="Source Sans 3")
    margin_width = Column(String, nullable=False, default="16px")
    columns = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    file = relationship("File", back_populates="file_settings")
    user = relationship("User", back_populates="file_settings")


class AnnotationType(str, enum.Enum):
    NOTE = "note"
    COMMENT = "comment"


class Annotation(Base):
    __tablename__ = "annotation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_id = Column(Integer, ForeignKey("files.id"), nullable=False)
    type: Column[AnnotationType] = Column(Enum(AnnotationType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    messages = relationship(
        "AnnotationMessage", back_populates="annotation", cascade="all, delete-orphan"
    )
    file = relationship("File", back_populates="annotations")


class AnnotationMessage(Base):
    __tablename__ = "annotation_message"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(Integer, ForeignKey("annotation.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    annotation = relationship("Annotation", back_populates="messages")
    owner = relationship("User", back_populates="annotation_messages")
