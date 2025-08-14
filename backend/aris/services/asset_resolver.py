"""Asset resolver service for RSM rendering.

This module provides asset resolution for RSM rendering by fetching assets
from the database instead of the filesystem.
"""

import base64
import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from ..models.models import FileAsset


logger = logging.getLogger(__name__)


class FileAssetResolver:
    """Simple asset resolver that fetches assets from the database.
    
    This resolver loads all assets for a given file_id upfront and provides
    synchronous access to them.
    """
    
    def __init__(self, assets: dict[str, str]):
        """Initialize resolver with pre-loaded assets.
        
        Parameters
        ----------
        assets
            Dictionary mapping asset filenames to their content
        """
        self._assets = assets
        
    def resolve_asset(self, path: str) -> Optional[str]:
        """Resolve an asset path to its content.
        
        Parameters
        ----------
        path
            The filename of the asset to resolve
            
        Returns
        -------
        Optional[str]
            The asset content as a string, or None if not found
        """
        return self._assets.get(path)
    
    @classmethod
    async def create_for_file(cls, file_id: int, db: AsyncSession) -> 'FileAssetResolver':
        """Create an asset resolver for a specific file.
        
        Parameters
        ----------
        file_id
            The ID of the file whose assets should be resolved
        db
            Database session for querying assets
            
        Returns
        -------
        FileAssetResolver
            Resolver with all assets pre-loaded
        """
        try:
            # Query all assets for this file
            from sqlalchemy import select
            result = await db.execute(
                select(FileAsset)
                .where(FileAsset.file_id == file_id)
                .where(FileAsset.deleted_at.is_(None))
            )
            assets = result.scalars().all()
            
            # Create assets dictionary with base64 decoding
            assets_dict: dict[str, str] = {}
            for asset in assets:
                try:
                    # Decode base64 content to get actual asset content
                    decoded_content = base64.b64decode(asset.content).decode('utf-8')
                    assets_dict[str(asset.filename)] = decoded_content
                    logger.info(f"Decoded asset {asset.filename}: {len(decoded_content)} chars, starts with: {decoded_content[:100]!r}")
                except Exception as e:
                    logger.error(f"Failed to decode asset {asset.filename} for file {file_id}: {e}")
                    # Skip this asset if decoding fails
                    continue
            
            logger.info(f"Loaded {len(assets_dict)} assets for file {file_id}")
            
            return cls(assets_dict)
            
        except Exception as e:
            logger.error(f"Failed to load assets for file {file_id}: {e}")
            return cls({})