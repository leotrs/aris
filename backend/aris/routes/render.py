"""Routes for rendering RSM into HTML."""

import time

from fastapi import APIRouter, Request
from pydantic import BaseModel

from .. import crud
from ..logging_config import get_logger


logger = get_logger(__name__)

router = APIRouter(prefix="/render", tags=["files"])


class RenderObject(BaseModel):
    source: str = ""


@router.post("")
async def render(request: Request, data: RenderObject):
    client_host = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    content_type = request.headers.get("content-type", "unknown")
    
    logger.info(f"[DEBUG-ROUTE] RENDER ENDPOINT HIT from {client_host}")
    logger.info(f"[DEBUG-ROUTE] User-Agent: {user_agent}")
    logger.info(f"[DEBUG-ROUTE] Content-Type: {content_type}")
    logger.info(f"[DEBUG-ROUTE] Request headers: {dict(request.headers)}")
    logger.info(f"[DEBUG-ROUTE] Data source length: {len(data.source)} chars")
    
    start_time = time.time()
    
    try:
        result = await crud.render(data.source)
        total_time = time.time() - start_time
        logger.info(f"[DEBUG-ROUTE] RENDER ENDPOINT COMPLETED in {total_time:.3f}s, returning {len(result)} chars")
        return result
    except Exception as e:
        total_time = time.time() - start_time
        logger.error(f"[DEBUG-ROUTE] RENDER ENDPOINT ERROR after {total_time:.3f}s: {e}")
        logger.error(f"[DEBUG-ROUTE] Error type: {type(e).__name__}")
        raise
