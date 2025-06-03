import asyncio
from aris import ArisSession
from aris.models import MOCK_FILES, MOCK_TAGS, MOCK_USERS


async def main():
    session = ArisSession()
    session.add_all(MOCK_USERS)
    await session.commit()
    session.add_all(MOCK_FILES)
    await session.commit()
    session.add_all(MOCK_TAGS)
    await session.commit()
    await session.close()
    print("Mock data added successfully!")


if __name__ == "__main__":
    asyncio.run(main())
