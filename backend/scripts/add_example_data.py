import sys
from pathlib import Path

import rsm
from aris import ArisSession
from aris.models import Document

FOLDER = Path("./.venv/lib/python3.13/site-packages/rsm-examples/")


def main():
    session = ArisSession()

    for filename in FOLDER.glob("*.rsm"):
        with filename.open(encoding="utf-8") as f:
            source = f.read()
            doc = Document(
                title="",
                abstract="",
                owner_id=1,
                source=source,
            )

            session.add(doc)
            session.flush()
            session.commit()
            print(f"Added {filename}!")

    session.close()


if __name__ == "__main__":
    main()
