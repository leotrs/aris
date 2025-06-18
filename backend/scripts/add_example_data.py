import asyncio
from pathlib import Path

from aris import ArisSession
from aris.models import File

FOLDER = Path("./.venv/lib/python3.13/site-packages/rsm-examples/")


async def main():
    session = ArisSession()

    for filename in FOLDER.glob("*.rsm"):
        with filename.open(encoding="utf-8") as f:
            source = f.read()
            doc = File(
                title="",
                abstract="",
                owner_id=1,
                source=source,
            )

            session.add(doc)
            await session.flush()
            await session.commit()
            print(f"Added {filename}!")

    await session.close()


if __name__ == "__main__":
    asyncio.run(main())
