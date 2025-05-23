from .models import File, FileStatus, Tag, User

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


MOCK_FILES = [
    File(
        title="Just a title",
        abstract="This is the abstract of sample file 1.",
        keywords="sample, research, test",
        status=FileStatus.DRAFT,
        owner_id=1,
        source="""\
        :rsm:
        # Just a title
        ::""",
    ),
    File(
        title="Title and a paragraph",
        abstract="This is the abstract of sample file 2.",
        keywords="example, science, test",
        status=FileStatus.UNDER_REVIEW,
        owner_id=2,
        source="""\
        :rsm:
        # My Title

        Lorem ipsum.

        ::
        """,
    ),
    File(
        title="Title, Section, and ParagraphSample File 3",
        abstract="This is the abstract of sample file 3.",
        keywords="research, test, study",
        status=FileStatus.PUBLISHED,
        owner_id=3,
        source="""\
        :rsm:

        Lorem ipsum.

        ## Section title

        Lorem ipsum.

        ::

        ::
        """,
    ),
]


MOCK_TAGS = [
    Tag(name="Research", user_id=1),
    Tag(name="Data Analysis", user_id=1),
    Tag(name="Machine Learning", user_id=2),
    Tag(name="Deep Learning", user_id=2),
    Tag(name="Network Science", user_id=2),
    Tag(name="Data Science", user_id=3),
    Tag(name="AI Ethics", user_id=3),
    Tag(name="Databases", user_id=3),
    Tag(name="Chem. Eng.", user_id=3),
]
