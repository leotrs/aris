from types import SimpleNamespace

import rsm

from aris.crud.utils import extract_section, extract_title


class DummyParser:
    def __init__(self, plain):
        self.plain = plain
        self.transformer = SimpleNamespace(tree=SimpleNamespace(title="ParsedTitle"))

    def run(self):
        pass


class DummyProcessor:
    def __init__(self, plain, handrails=True):
        self.plain = plain
        self.translator = SimpleNamespace(body="<div class='sec'>Content</div>")

    def run(self):
        pass


async def test_extract_title_none_file():
    assert await extract_title(None) == ""


async def test_extract_title_existing_title():
    file = SimpleNamespace(title="Hello", source="ignored")
    result = await extract_title(file)
    assert result == "Hello"


async def test_extract_title_parsed(monkeypatch):
    file = SimpleNamespace(title=None, source="some source")
    monkeypatch.setattr(rsm.app, "ParserApp", DummyParser)
    result = await extract_title(file)
    assert result == "ParsedTitle"


async def test_extract_section_found(monkeypatch):
    file = SimpleNamespace(source="dummy")
    monkeypatch.setattr(rsm.app, "ProcessorApp", DummyProcessor)
    result = await extract_section(file, "sec", handrails=False)
    assert '<div class="sec">Content</div>' in result
    assert "Content" in result


async def test_extract_section_not_found(monkeypatch):
    class NoSectionProcessor:
        def __init__(self, plain, handrails=True):
            self.translator = SimpleNamespace(body="<div class='other'>Other</div>")

        def run(self):
            pass

    monkeypatch.setattr(rsm.app, "ProcessorApp", NoSectionProcessor)
    file = SimpleNamespace(source="dummy")
    result = await extract_section(file, "sec")
    assert result == ""
