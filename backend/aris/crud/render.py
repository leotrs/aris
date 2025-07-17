import time

import rsm

from ..logging_config import get_logger


logger = get_logger(__name__)


async def render(src: str):
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
