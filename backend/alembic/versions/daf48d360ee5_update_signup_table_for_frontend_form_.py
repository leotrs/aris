"""update signup table for frontend form structure

Revision ID: daf48d360ee5
Revises: 7b34401c55b7
Create Date: 2025-08-04 19:35:13.814150

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'daf48d360ee5'
down_revision: Union[str, None] = '7b34401c55b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Remove old fields that don't match frontend form
    op.drop_column('signups', 'name')
    op.drop_column('signups', 'institution')
    op.drop_column('signups', 'research_area')
    op.drop_column('signups', 'interest_level')
    
    # Add new fields that match frontend form
    op.add_column('signups', sa.Column('authoring_tools', sa.Text(), nullable=True))
    op.add_column('signups', sa.Column('improvements', sa.Text(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove new fields
    op.drop_column('signups', 'improvements')
    op.drop_column('signups', 'authoring_tools')
    
    # Restore old fields
    op.add_column('signups', sa.Column('name', sa.String(), nullable=False))
    op.add_column('signups', sa.Column('institution', sa.String(), nullable=True))
    op.add_column('signups', sa.Column('research_area', sa.String(), nullable=True))
    op.add_column('signups', sa.Column('interest_level', sa.Enum('EXPLORING', 'PLANNING', 'READY', 'MIGRATING', name='interestlevel'), nullable=True))
