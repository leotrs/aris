import time

import rsm

from ..logging_config import get_logger


logger = get_logger(__name__)


async def render(src: str):
    logger.info(f"[DEBUG-BACKEND] RENDER REQUEST RECEIVED: {len(src)} characters")
    logger.info(f"[DEBUG-BACKEND] RSM Source preview (first 100 chars): {src[:100]}...")
    start_time = time.time()
    
    try:
        logger.info("[DEBUG-BACKEND] Starting RSM.render() call")
        result = rsm.render(src, handrails=True)
        render_time = time.time() - start_time
        result_length = len(result)
        logger.info(f"[DEBUG-BACKEND] RSM render completed successfully in {render_time:.3f}s, generated {result_length} chars")
        logger.info(f"[DEBUG-BACKEND] Result preview (first 100 chars): {result[:100]}...")
    except rsm.RSMApplicationError as e:
        render_time = time.time() - start_time
        logger.error(f"[DEBUG-BACKEND] RSM render failed after {render_time:.3f}s: {e}")
        logger.error(f"[DEBUG-BACKEND] RSM error type: {type(e).__name__}")
        logger.error(f"[DEBUG-BACKEND] RSM error details: {str(e)}")
        result = ""
    except Exception as e:
        render_time = time.time() - start_time
        logger.error(f"[DEBUG-BACKEND] Unexpected error during RSM render after {render_time:.3f}s: {e}")
        logger.error(f"[DEBUG-BACKEND] Error type: {type(e).__name__}")
        logger.error(f"[DEBUG-BACKEND] Error details: {str(e)}")
        result = ""
    
    logger.info(f"[DEBUG-BACKEND] RENDER REQUEST COMPLETED in {time.time() - start_time:.3f}s")
    return result
