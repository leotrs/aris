from datetime import datetime, timezone
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
    User(
        name="Test User",
        email="testuser@aris.pub",
        password_hash="$2b$12$TVuqGqn6SWbVFres301hUu6BtCWQHa.xpGPK4EwAKZo8mw50WXKBW",
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
    File(
        title="Test Visual Regression File",
        abstract="Stable test file for visual regression testing.",
        keywords="test, visual, regression",
        status=FileStatus.DRAFT,
        owner_id=4,
        source="""\
        :rsm:
        # Test Visual Regression File

        This file is used for visual regression testing.
        Content should remain stable.

        ## Section 1
        Lorem ipsum test content.

        ## Section 2
        More stable test content here.

        ::""",
    ),
    File(
        title="Another Test File",
        abstract="Second stable test file.",
        keywords="test, stable, visual",
        status=FileStatus.DRAFT,
        owner_id=4,
        source="""\
        :rsm:
        # Another Test File

        This is another stable test file for visual tests.

        ::""",
    ),
    # Demo preprint for E2E testing
    File(
        title="Sample Research Paper: The Future of Web-Native Publishing",
        abstract="This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated. We examine the limitations of traditional PDF-based publishing and propose a new paradigm that leverages modern web technologies to create interactive, accessible, and dynamic research documents.",
        keywords="web-native, publishing, research, interactive, accessibility",
        authors="Dr. Sarah Chen, Prof. Michael Rodriguez",
        status=FileStatus.PUBLISHED,
        published_at=datetime(2025, 1, 15, 10, 0, 0, tzinfo=timezone.utc),
        public_uuid="demo",
        permalink_slug="future-web-native-publishing",
        version=1,
        owner_id=1,
        source="""\
:rsm:
# The Future of Web-Native Publishing

:abstract:

  This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated. We examine the limitations of traditional PDF-based publishing and propose a new paradigm that leverages modern web technologies to create interactive, accessible, and dynamic research documents.

::

## Introduction

The current landscape of scientific publishing relies heavily on static document formats that were designed for print media. While PDFs have served the academic community for decades, they present significant limitations in our increasingly digital world:

:itemize:

  :item: *Limited interactivity*: Static content cannot adapt to user preferences or provide dynamic visualizations

  :item: *Accessibility barriers*: Poor screen reader support and fixed layouts

  :item: *Version control issues*: Difficulty tracking changes and updates

  :item: *Discovery challenges*: Content locked in non-searchable formats

::

### Research Questions

This study addresses three primary research questions:

:enumerate:

  :item: How can web-native technologies improve research accessibility and engagement?

  :item: What are the key technical requirements for a modern publishing platform?

  :item: How might interactive documents change the peer review process?

::

## Methodology

Our research employed a mixed-methods methodology approach combining:

:itemize:

  :item: Literature review of existing publishing platforms

  :item: Technical analysis of web standards and capabilities

  :item: User interviews with researchers and publishers

  :item: Prototype development and testing

::

### Technical Implementation

We developed a proof-of-concept platform using:

:itemize:

  :item: **Frontend**: Vue.js with reactive state management

  :item: **Backend**: FastAPI with PostgreSQL database

  :item: **Document Format**: RSM (Readable Research Markup)

  :item: **Deployment**: Docker containers on cloud infrastructure

::

## Results

Our findings demonstrate significant advantages of web-native publishing across multiple dimensions. The methodology validation confirmed our hypothesis that web-native platforms provide superior accessibility and engagement compared to traditional PDF-based systems.

## Discussion

The transition to web-native publishing represents more than a technological upgrade—it's a fundamental shift toward more inclusive and accessible research communication.

### Key Benefits

:enumerate:

  :item: *Enhanced Accessibility*: Screen readers, keyboard navigation, and customizable display options

  :item: *Dynamic Content*: Interactive figures, embedded data, and real-time updates

  :item: *Better Discovery*: Full-text search, semantic markup, and linked data

  :item: *Collaborative Features*: Inline comments, annotations, and version tracking

::

## Future Work

Future research should explore the integration of machine learning algorithms for automated content enhancement and the development of standardized protocols for cross-platform compatibility.

## Conclusion

Web-native publishing platforms represent a paradigm shift that addresses fundamental limitations of traditional academic publishing while enabling new forms of scholarly communication.

::""",
    ),
]


MOCK_TAGS = [
    Tag(name="Research", user_id=1, color="ORANGE"),
    Tag(name="Data Analysis", user_id=1, color="RED"),
    Tag(name="Machine Learning", user_id=2, color="PURPLE"),
    Tag(name="Deep Learning", user_id=2, color="GREEN"),
    Tag(name="Network Science", user_id=2, color="RED"),
    Tag(name="Data Science", user_id=3, color="GREEN"),
    Tag(name="AI Ethics", user_id=3, color="ORANGE"),
    Tag(name="Databases", user_id=3, color="PURPLE"),
    Tag(name="Chem. Eng.", user_id=3, color="GREEN"),
    Tag(name="Visual Testing", user_id=4, color="BLUE"),
    Tag(name="Regression", user_id=4, color="GREEN"),
]
