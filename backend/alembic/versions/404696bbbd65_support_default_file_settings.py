"""Support default file settings

Revision ID: 404696bbbd65
Revises: a8bcc7a54da2
Create Date: 2025-06-07 12:06:10.344394

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "404696bbbd65"
down_revision: Union[str, None] = "a8bcc7a54da2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("file_settings", "file_id", existing_type=sa.INTEGER(), nullable=True)
    op.create_index(
        "ix_unique_default_settings_per_user",
        "file_settings",
        ["user_id"],
        unique=True,
        postgresql_where=sa.text("file_id IS NULL"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        "ix_unique_default_settings_per_user",
        table_name="file_settings",
        postgresql_where=sa.text("file_id IS NULL"),
    )
    op.alter_column("file_settings", "file_id", existing_type=sa.INTEGER(), nullable=False)
    # ### end Alembic commands ###
