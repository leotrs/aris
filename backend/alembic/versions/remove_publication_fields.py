"""Remove publication fields from File model

Revision ID: remove_publication_fields
Revises: fcc9ed287b43
Create Date: 2025-01-28

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'remove_publication_fields'
down_revision: Union[str, None] = 'fcc9ed287b43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop columns from files table
    op.drop_column('files', 'doi')
    op.drop_column('files', 'published_at')
    op.drop_column('files', 'public_uuid')
    op.drop_column('files', 'permalink_slug')
    
    # Drop column from users table
    op.drop_column('users', 'affiliation')
    
    # Remove UNDER_REVIEW and PUBLISHED files (they're no longer supported)
    op.execute("DELETE FROM files WHERE status IN ('UNDER_REVIEW', 'PUBLISHED')")
    
    # Remove UNDER_REVIEW and PUBLISHED values from FileStatus enum
    # This requires recreating the enum type
    op.execute("ALTER TYPE filestatus RENAME TO filestatus_old")
    op.execute("CREATE TYPE filestatus AS ENUM ('DRAFT')")
    # Keep DRAFT values as DRAFT during the type conversion
    op.execute("ALTER TABLE files ALTER COLUMN status TYPE filestatus USING CASE WHEN status::text = 'DRAFT' THEN 'DRAFT'::filestatus END")
    op.execute("DROP TYPE filestatus_old")


def downgrade() -> None:
    # Recreate the old FileStatus enum
    op.execute("ALTER TYPE filestatus RENAME TO filestatus_old")
    op.execute("CREATE TYPE filestatus AS ENUM ('DRAFT', 'UNDER_REVIEW', 'PUBLISHED')")
    op.execute("ALTER TABLE files ALTER COLUMN status TYPE filestatus USING status::text::filestatus")
    op.execute("DROP TYPE filestatus_old")
    
    # Re-add columns to users table
    op.add_column('users', sa.Column('affiliation', sa.String(), nullable=True))
    
    # Re-add columns to files table
    op.add_column('files', sa.Column('permalink_slug', sa.String(), nullable=True))
    op.add_column('files', sa.Column('public_uuid', sa.String(length=6), nullable=True))
    op.add_column('files', sa.Column('published_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('files', sa.Column('doi', sa.String(), nullable=True))
    
    # Re-add unique constraints
    op.create_unique_constraint(None, 'files', ['doi'])
    op.create_unique_constraint(None, 'files', ['public_uuid'])
    op.create_unique_constraint(None, 'files', ['permalink_slug'])