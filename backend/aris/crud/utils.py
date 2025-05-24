import asyncio

import rsm
from bs4 import BeautifulSoup

from ..models import File


async def extract_title(file: File) -> str:
    if file is None:
        return ""
    if file.title:
        return file.title

    app = rsm.app.ParserApp(plain=file.source)
    await asyncio.to_thread(app.run)
    return app.transformer.tree.title


async def extract_section(file: File, section_name: str, handrails: bool = True) -> str:
    app = rsm.app.ProcessorApp(plain=file.source, handrails=handrails)
    await asyncio.to_thread(app.run)
    html = app.translator.body

    soup = BeautifulSoup(html, "lxml")
    element = soup.find("div", class_=section_name)
    return element if element else None
