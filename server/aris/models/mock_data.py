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
        title="Sample Document 1",
        abstract="This is the abstract of sample document 1.",
        keywords="sample, research, test",
        status=DocumentStatus.DRAFT,
        owner_id=1,
    ),
    Document(
        title="Sample Document 2",
        abstract="This is the abstract of sample document 2.",
        keywords="example, science, test",
        status=DocumentStatus.UNDER_REVIEW,
        owner_id=2,
    ),
    Document(
        title="Sample Document 3",
        abstract="This is the abstract of sample document 3.",
        keywords="research, test, study",
        status=DocumentStatus.PUBLISHED,
        owner_id=3,
    ),
]
