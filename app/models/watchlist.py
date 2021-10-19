from .db import db


watchlist_stocks = db.Table("watchlist_stocks",
    db.Column("stock_id", db.Integer, db.ForeignKey("stocks.id")),
    db.Column("watchlist_id",db.Integer, db.ForeignKey("watchlists.id"))
)


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    name = db.Column(db.String(255),nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)

    owner = db.relationship("Watchlist",back_populates="watchlists")
    watchlist_stocks = db.relationship("Stock",secondary="watchlist_stocks", backref=db.backref("watchlist_stocks", lazy = "dynamic"))
