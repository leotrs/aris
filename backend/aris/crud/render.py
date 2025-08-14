import time

import rsm
from sqlalchemy.ext.asyncio import AsyncSession

from ..logging_config import get_logger
from ..services.asset_resolver import FileAssetResolver


logger = get_logger(__name__)


async def render(src: str):
    """Render RSM source to HTML without asset resolution."""
    logger.debug(f"Starting RSM render for {len(src)} characters")
    start_time = time.time()
    
    try:
        result = rsm.render(src, handrails=True)
        render_time = time.time() - start_time
        logger.debug(f"RSM render completed successfully in {render_time:.3f}s")
    except rsm.RSMApplicationError as e:
        render_time = time.time() - start_time
        logger.error(f"RSM render failed after {render_time:.3f}s: {e}")
        result = ""
    return result


async def render_with_assets(src: str, file_id: int, db: AsyncSession, user_id: int):
    """Render RSM source to HTML with database asset resolution."""
    logger.debug(f"Starting RSM render with assets for {len(src)} characters, file_id={file_id}")
    start_time = time.time()
    
    try:
        # Create asset resolver for this file with pre-loaded assets
        asset_resolver = await FileAssetResolver.create_for_file(file_id, db)
        
        result = rsm.render(src, handrails=True, asset_resolver=asset_resolver)
        render_time = time.time() - start_time
        logger.debug(f"RSM render with assets completed successfully in {render_time:.3f}s")
    except rsm.RSMApplicationError as e:
        render_time = time.time() - start_time
        logger.error(f"RSM render with assets failed after {render_time:.3f}s: {e}")
        result = ""
    return result
