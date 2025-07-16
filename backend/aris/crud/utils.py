import asyncio
import logging

import rsm
import shortuuid
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from ..models import File


async def extract_title(file: File) -> str:
    if file is None:
        return ""
    # Access the actual value, not the column definition
    if file.title is not None:
        return str(file.title)

    source_content = str(file.source) if file.source is not None else ""
    app = rsm.app.ParserApp(plain=source_content)
    await asyncio.to_thread(app.run)
    # Return the actual title string, not the column
    return str(app.transformer.tree.title) if app.transformer.tree.title else ""


async def extract_section(file: File, section_name: str, handrails: bool = True) -> str:
    source_content = str(file.source) if file.source is not None else ""
    app = rsm.app.ProcessorApp(plain=source_content, handrails=handrails)
    await asyncio.to_thread(app.run)
    html = app.translator.body

    soup = BeautifulSoup(html, "lxml")
    element = soup.find("div", class_=section_name)
    # Return the string content of the element, or empty string if not found
    return str(element) if element else ""


def generate_public_uuid() -> str:
    """Generate a 6-character URL-safe UUID for public preprints.
    
    Returns
    -------
    str
        A 6-character URL-safe UUID string.
    """
    return shortuuid.uuid()[:6]


def is_valid_public_uuid(uuid: str) -> bool:
    """Validate that a string is a valid public UUID format.
    
    Parameters
    ----------
    uuid : str
        The UUID string to validate.
        
    Returns
    -------
    bool
        True if the UUID is valid, False otherwise.
    """
    if not isinstance(uuid, str):
        return False
    
    if len(uuid) != 6:
        return False
    
    # Check if all characters are in shortuuid's alphabet
    # shortuuid uses base57: 23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz
    valid_chars = set("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz")
    return all(c in valid_chars for c in uuid)


def generate_unique_public_uuid(session: Session, max_retries: int = 10) -> str:
    """Generate a unique public UUID that doesn't exist in the database.
    
    Parameters
    ----------
    session : Session
        SQLAlchemy database session for checking uniqueness.
    max_retries : int, default=10
        Maximum number of retry attempts for collision resolution.
        
    Returns
    -------
    str
        A unique 6-character UUID string.
        
    Raises
    ------
    RuntimeError
        If unable to generate a unique UUID after max_retries attempts.
    """
    logger = logging.getLogger(__name__)
    
    for attempt in range(max_retries):
        uuid = generate_public_uuid()
        
        # Check if UUID already exists
        existing = session.execute(
            select(File).where(File.public_uuid == uuid)
        ).first()
        
        if existing is None:
            if attempt > 0:
                logger.info(f"Generated unique UUID after {attempt + 1} attempts: {uuid}")
            return uuid
        
        logger.debug(f"UUID collision detected on attempt {attempt + 1}: {uuid}")
    
    # If we get here, we couldn't generate a unique UUID
    error_msg = f"Failed to generate unique UUID after {max_retries} attempts"
    logger.error(error_msg)
    raise RuntimeError(error_msg)


async def generate_unique_public_uuid_async(session: AsyncSession, max_retries: int = 10) -> str:
    """Generate a unique public UUID that doesn't exist in the database (async version).
    
    Parameters
    ----------
    session : AsyncSession
        SQLAlchemy async database session for checking uniqueness.
    max_retries : int, default=10
        Maximum number of retry attempts for collision resolution.
        
    Returns
    -------
    str
        A unique 6-character UUID string.
        
    Raises
    ------
    RuntimeError
        If unable to generate a unique UUID after max_retries attempts.
    """
    logger = logging.getLogger(__name__)
    
    for attempt in range(max_retries):
        uuid = generate_public_uuid()
        
        # Check if UUID already exists
        result = await session.execute(
            select(File).where(File.public_uuid == uuid)
        )
        existing = result.first()
        
        if existing is None:
            if attempt > 0:
                logger.info(f"Generated unique UUID after {attempt + 1} attempts: {uuid}")
            return uuid
        
        logger.debug(f"UUID collision detected on attempt {attempt + 1}: {uuid}")
    
    # If we get here, we couldn't generate a unique UUID
    error_msg = f"Failed to generate unique UUID after {max_retries} attempts"
    logger.error(error_msg)
    raise RuntimeError(error_msg)


def assign_public_uuid_with_retry(session: Session, file: File, max_retries: int = 10) -> str:
    """Assign a unique public UUID to a file with collision handling.
    
    Parameters
    ----------
    session : Session
        SQLAlchemy database session.
    file : File
        The file to assign a UUID to.
    max_retries : int, default=10
        Maximum number of retry attempts for collision resolution.
        
    Returns
    -------
    str
        The assigned UUID string.
        
    Raises
    ------
    RuntimeError
        If unable to assign a unique UUID after max_retries attempts.
    """
    logger = logging.getLogger(__name__)
    
    for attempt in range(max_retries):
        try:
            uuid = generate_public_uuid()
            file.public_uuid = uuid
            session.flush()  # Trigger constraint check without committing
            
            if attempt > 0:
                logger.info(f"Assigned unique UUID after {attempt + 1} attempts: {uuid}")
            return uuid
            
        except IntegrityError as e:
            logger.debug(f"UUID collision detected on attempt {attempt + 1}: {uuid}")
            session.rollback()
            
            # Re-attach the file to the session if needed
            if file not in session:
                session.add(file)
            
            if attempt == max_retries - 1:
                error_msg = f"Failed to assign unique UUID after {max_retries} attempts"
                logger.error(error_msg)
                raise RuntimeError(error_msg) from e
    
    # This should never be reached, but added for completeness
    raise RuntimeError("Unexpected error in UUID assignment")


async def assign_public_uuid_with_retry_async(session: AsyncSession, file: File, max_retries: int = 10) -> str:
    """Assign a unique public UUID to a file with collision handling (async version).
    
    Parameters
    ----------
    session : AsyncSession
        SQLAlchemy async database session.
    file : File
        The file to assign a UUID to.
    max_retries : int, default=10
        Maximum number of retry attempts for collision resolution.
        
    Returns
    -------
    str
        The assigned UUID string.
        
    Raises
    ------
    RuntimeError
        If unable to assign a unique UUID after max_retries attempts.
    """
    logger = logging.getLogger(__name__)
    
    for attempt in range(max_retries):
        try:
            uuid = generate_public_uuid()
            file.public_uuid = uuid
            await session.flush()  # Trigger constraint check without committing
            
            if attempt > 0:
                logger.info(f"Assigned unique UUID after {attempt + 1} attempts: {uuid}")
            return uuid
            
        except IntegrityError as e:
            logger.debug(f"UUID collision detected on attempt {attempt + 1}: {uuid}")
            await session.rollback()
            
            # Re-attach the file to the session if needed
            if file not in session:
                session.add(file)
            
            if attempt == max_retries - 1:
                error_msg = f"Failed to assign unique UUID after {max_retries} attempts"
                logger.error(error_msg)
                raise RuntimeError(error_msg) from e
    
    # This should never be reached, but added for completeness
    raise RuntimeError("Unexpected error in UUID assignment")
