"""empty message

Revision ID: 348ce474de56
Revises: 
Create Date: 2024-03-26 15:49:25.191373

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '348ce474de56'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('car_type',
    sa.Column('model', sa.String(length=128), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_car_type_id'), 'car_type', ['id'], unique=False)
    op.create_table('patient',
    sa.Column('adress', sa.String(length=128), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=False),
    sa.Column('second_name', sa.String(length=64), nullable=False),
    sa.Column('patronymic', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_patient_id'), 'patient', ['id'], unique=False)
    op.create_table('post',
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_post_id'), 'post', ['id'], unique=False)
    op.create_table('status_type',
    sa.Column('name', sa.String(length=32), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_status_type_id'), 'status_type', ['id'], unique=False)
    op.create_table('symptom',
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_symptom_id'), 'symptom', ['id'], unique=False)
    op.create_table('car',
    sa.Column('type_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['type_id'], ['car_type.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_car_id'), 'car', ['id'], unique=False)
    op.create_table('status',
    sa.Column('status_type_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('end_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['status_type_id'], ['status_type.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_status_id'), 'status', ['id'], unique=False)
    op.create_table('worker',
    sa.Column('is_ill', sa.Boolean(), nullable=True),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=False),
    sa.Column('second_name', sa.String(length=64), nullable=False),
    sa.Column('patronymic', sa.String(length=64), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_worker_id'), 'worker', ['id'], unique=False)
    op.create_table('call',
    sa.Column('patient_id', sa.Integer(), nullable=False),
    sa.Column('status_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['patient_id'], ['patient.id'], ),
    sa.ForeignKeyConstraint(['status_id'], ['status.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_call_id'), 'call', ['id'], unique=False)
    op.create_table('driver',
    sa.Column('is_ill', sa.Boolean(), nullable=True),
    sa.Column('car_id', sa.Integer(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=False),
    sa.Column('second_name', sa.String(length=64), nullable=False),
    sa.Column('patronymic', sa.String(length=64), nullable=True),
    sa.ForeignKeyConstraint(['car_id'], ['car.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_driver_id'), 'driver', ['id'], unique=False)
    op.create_table('driver_xref_call',
    sa.Column('call_id', sa.Integer(), nullable=False),
    sa.Column('driver_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['call_id'], ['call.id'], ),
    sa.ForeignKeyConstraint(['driver_id'], ['driver.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_driver_xref_call_id'), 'driver_xref_call', ['id'], unique=False)
    op.create_table('patient_xref_symptom',
    sa.Column('patient_id', sa.Integer(), nullable=False),
    sa.Column('symptom_id', sa.Integer(), nullable=False),
    sa.Column('call_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['call_id'], ['call.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['patient.id'], ),
    sa.ForeignKeyConstraint(['symptom_id'], ['symptom.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_patient_xref_symptom_id'), 'patient_xref_symptom', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_patient_xref_symptom_id'), table_name='patient_xref_symptom')
    op.drop_table('patient_xref_symptom')
    op.drop_index(op.f('ix_driver_xref_call_id'), table_name='driver_xref_call')
    op.drop_table('driver_xref_call')
    op.drop_index(op.f('ix_driver_id'), table_name='driver')
    op.drop_table('driver')
    op.drop_index(op.f('ix_call_id'), table_name='call')
    op.drop_table('call')
    op.drop_index(op.f('ix_worker_id'), table_name='worker')
    op.drop_table('worker')
    op.drop_index(op.f('ix_status_id'), table_name='status')
    op.drop_table('status')
    op.drop_index(op.f('ix_car_id'), table_name='car')
    op.drop_table('car')
    op.drop_index(op.f('ix_symptom_id'), table_name='symptom')
    op.drop_table('symptom')
    op.drop_index(op.f('ix_status_type_id'), table_name='status_type')
    op.drop_table('status_type')
    op.drop_index(op.f('ix_post_id'), table_name='post')
    op.drop_table('post')
    op.drop_index(op.f('ix_patient_id'), table_name='patient')
    op.drop_table('patient')
    op.drop_index(op.f('ix_car_type_id'), table_name='car_type')
    op.drop_table('car_type')
    # ### end Alembic commands ###