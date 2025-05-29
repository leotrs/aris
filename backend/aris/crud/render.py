import logging
from sqlalchemy.orm import Session

import rsm


logger = logging.getLogger("RSM")


async def render(src: str, db: Session):
    try:
        result = rsm.render(src, handrails=True)
    except rsm.RSMApplicationError as e:
        logger.error(f"There was an error rendering the code: {e}")
        result = ""
    return result
