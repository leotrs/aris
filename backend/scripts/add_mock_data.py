from aris import ArisSession
from aris.models import MOCK_DOCUMENTS, MOCK_TAGS, MOCK_USERS


def main():
    session = ArisSession()
    session.add_all(MOCK_USERS)
    session.flush()
    session.add_all(MOCK_DOCUMENTS)
    session.flush()
    session.add_all(MOCK_TAGS)
    session.commit()
    session.close()
    print("Mock data added successfully!")


if __name__ == "__main__":
    main()
