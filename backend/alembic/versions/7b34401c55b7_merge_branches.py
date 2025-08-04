"""merge branches

Revision ID: 7b34401c55b7
Revises: 59878b55c0bc, remove_publication_fields
Create Date: 2025-08-04 19:35:10.125173

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = '7b34401c55b7'
down_revision: Union[str, None] = ('59878b55c0bc', 'remove_publication_fields')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
