from .models import Document, DocumentStatus, User

MOCK_USERS = [
    User(
        name="John Doe",
        email="john.doe@example.com",
        password_hash="hashedpassword1",
    ),
    User(
        name="Jane Smith",
        email="jane.smith@example.com",
        password_hash="hashedpassword2",
    ),
    User(
        name="Alice Johnson",
        email="alice.johnson@example.com",
        password_hash="hashedpassword3",
    ),
]


MOCK_DOCUMENTS = [
    Document(
        title="Just a title",
        abstract="This is the abstract of sample document 1.",
        keywords="sample, research, test",
        status=DocumentStatus.DRAFT,
        owner_id=1,
        source="""\
        :manuscript:
          :title: Just a title
        ::""",
    ),
    Document(
        title="Title and a paragraph",
        abstract="This is the abstract of sample document 2.",
        keywords="example, science, test",
        status=DocumentStatus.UNDER_REVIEW,
        owner_id=2,
        source="""\
        :manuscript:
          :title: My Title

        Lorem ipsum.

        ::
        """,
    ),
    Document(
        title="Title, Section, and ParagraphSample Document 3",
        abstract="This is the abstract of sample document 3.",
        keywords="research, test, study",
        status=DocumentStatus.PUBLISHED,
        owner_id=3,
        source="""\
        :manuscript:

        Lorem ipsum.

        :section:
          :title: section title

        Lorem ipsum.

        ::

        ::
        """,
    ),
]
