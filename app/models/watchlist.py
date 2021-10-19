from .db import db


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    name = db.Column(db.String(255),nullable=False)
    userId = db.Column(db.Integer(10),db.ForeignKey("users.id"),nullable=False)
