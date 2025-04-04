import rsm

from ..models import Document


def extract_title(doc: Document) -> str:
    if doc is None:
        return ""
    if doc.title:
        return doc.title
    app = rsm.app.ParserApp(plain=doc.source)
    app.run()
    return app.transformer.tree.title
