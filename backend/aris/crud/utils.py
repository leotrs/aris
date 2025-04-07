import asyncio
import logging

import rsm
from bs4 import BeautifulSoup

from ..models import Document


async def extract_title(doc: Document) -> str:
    if doc is None:
        return ""
    if doc.title:
        return doc.title

    app = rsm.app.ParserApp(plain=doc.source)
    await asyncio.to_thread(app.run)
    return app.transformer.tree.title


async def extract_section(doc: Document, section_name: str) -> str:
    app = rsm.app.ProcessorApp(plain=doc.source, handrails=True)
    await asyncio.to_thread(app.run)
    html = app.translator.body

    soup = BeautifulSoup(html, "lxml")
    element = soup.find("div", class_=section_name)
    return element if element else None
