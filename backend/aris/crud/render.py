import logging

import rsm
from sqlalchemy.ext.asyncio import AsyncSession


logger = logging.getLogger("RSM")


async def render(src: str, db: AsyncSession):
    try:
        result = rsm.render(src, handrails=True)
    except rsm.RSMApplicationError as e:
        logger.error(f"There was an error rendering the code: {e}")
        result = ""
    return result
