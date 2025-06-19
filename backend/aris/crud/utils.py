import asyncio

import rsm
from bs4 import BeautifulSoup

from ..models import File


async def extract_title(file: File) -> str:
    if file is None:
        return ""
    # Access the actual value, not the column definition
    if file.title is not None:
        return str(file.title)

    source_content = str(file.source) if file.source is not None else ""
    app = rsm.app.ParserApp(plain=source_content)
    await asyncio.to_thread(app.run)
    # Return the actual title string, not the column
    return str(app.transformer.tree.title) if app.transformer.tree.title else ""


async def extract_section(file: File, section_name: str, handrails: bool = True) -> str:
    source_content = str(file.source) if file.source is not None else ""
    app = rsm.app.ProcessorApp(plain=source_content, handrails=handrails)
    await asyncio.to_thread(app.run)
    html = app.translator.body

    soup = BeautifulSoup(html, "lxml")
    element = soup.find("div", class_=section_name)
    # Return the string content of the element, or empty string if not found
    return str(element) if element else ""
