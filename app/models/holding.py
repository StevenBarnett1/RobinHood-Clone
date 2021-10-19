from .db import db


class Holding(db.Model):
    __tablename__ = 'holdings'

    stock_id = db.Column(db.Integer,db.ForeignKey("stocks.id"),nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    shares = db.Column(db.Float,nullable=False)
