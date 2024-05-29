"""empty message

Revision ID: d151242db5e6
Revises: 609e77c2d092
Create Date: 2024-05-23 10:34:42.343644

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd151242db5e6'
down_revision: Union[str, None] = '609e77c2d092'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('test_model_1000',
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('some_string', sa.String(length=128), nullable=True),
    sa.Column('date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('fake_unique', sa.String(length=64), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('fake_unique')
    )
    op.create_index(op.f('ix_test_model_1000_id'), 'test_model_1000', ['id'], unique=False)
    op.create_table('test_model_10000',
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('some_string', sa.String(length=128), nullable=True),
    sa.Column('date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('fake_unique', sa.String(length=64), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('fake_unique')
    )
    op.create_index(op.f('ix_test_model_10000_id'), 'test_model_10000', ['id'], unique=False)
    op.create_table('test_model_100000',
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('some_string', sa.String(length=128), nullable=True),
    sa.Column('date', sa.DateTime(timezone=True), nullable=True),
    sa.Column('fake_unique', sa.String(length=64), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('fake_unique')
    )
    op.create_index(op.f('ix_test_model_100000_id'), 'test_model_100000', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_test_model_100000_id'), table_name='test_model_100000')
    op.drop_table('test_model_100000')
    op.drop_index(op.f('ix_test_model_10000_id'), table_name='test_model_10000')
    op.drop_table('test_model_10000')
    op.drop_index(op.f('ix_test_model_1000_id'), table_name='test_model_1000')
    op.drop_table('test_model_1000')
    # ### end Alembic commands ###