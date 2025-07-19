import asyncio

from sqlalchemy import select, delete, text
from aris import ArisSession
from aris.models import MOCK_FILES, MOCK_TAGS, MOCK_USERS, User, File, Tag


async def main():
    async with ArisSession() as session:
        # Clear existing mock data in reverse dependency order
        await session.execute(delete(Tag))
        await session.execute(delete(File))
        await session.execute(delete(User))
        await session.commit()
        
        # Reset ID sequences to start from 1
        await session.execute(text("ALTER SEQUENCE users_id_seq RESTART WITH 1"))
        await session.execute(text("ALTER SEQUENCE files_id_seq RESTART WITH 1"))
        await session.execute(text("ALTER SEQUENCE tags_id_seq RESTART WITH 1"))
        await session.commit()
        
        # Add fresh mock data in dependency order
        session.add_all(MOCK_USERS)
        await session.commit()
        session.add_all(MOCK_FILES)
        await session.commit()
        session.add_all(MOCK_TAGS)
        await session.commit()
        print("Mock data added successfully!")


if __name__ == "__main__":
    asyncio.run(main())
