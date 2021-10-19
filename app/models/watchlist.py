from .db import db


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    name = db.Column(db.String(255),nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
