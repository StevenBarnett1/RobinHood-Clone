"""empty message

Revision ID: 2106dbc669d7
Revises: b26b945a8e48
Create Date: 2021-10-21 14:02:06.559911

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2106dbc669d7'
down_revision = 'b26b945a8e48'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('holdings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('stock_id', sa.Integer(), nullable=True),
    sa.Column('shares', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('holdings')
    # ### end Alembic commands ###
