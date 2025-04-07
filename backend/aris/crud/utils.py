import asyncio

import rsm

from ..models import Document


async def extract_title(doc: Document) -> str:
    if doc is None:
        return ""
    if doc.title:
        return doc.title

    app = rsm.app.ParserApp(plain=doc.source)
    await asyncio.to_thread(app.run)
    return app.transformer.tree.title
