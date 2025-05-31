"""fix_utc_timestamps

Revision ID: 2775640c593a
Revises: 6e5744b33158
Create Date: 2025-05-31 14:16:44.039547

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2775640c593a"
down_revision: Union[str, None] = "6e5744b33158"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Update users.deleted_at to timezone-aware
    op.alter_column(
        "users",
        "deleted_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=True,
    )

    # Update tags.deleted_at to timezone-aware
    op.alter_column(
        "tags",
        "deleted_at",
        existing_type=sa.DateTime(),
        type_=sa.DateTime(timezone=True),
        existing_nullable=True,
    )


def downgrade():
    # Revert changes if needed
    op.alter_column(
        "tags",
        "deleted_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        existing_nullable=True,
    )

    op.alter_column(
        "users",
        "deleted_at",
        existing_type=sa.DateTime(timezone=True),
        type_=sa.DateTime(),
        existing_nullable=True,
    )
