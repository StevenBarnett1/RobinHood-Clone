from .db import db


watchlist_stocks = db.Table("watchlist_stocks",
    db.Column("stock_id", db.Integer, db.ForeignKey("stocks.id"), nullable = False),
    db.Column("watchlist_id",db.Integer, db.ForeignKey("watchlists.id"), nullable = False)
)


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255),nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)

    owner = db.relationship("User",back_populates="watchlists")
    # watchlist_stocks = db.relationship("Stock",secondary="watchlist_stocks", backref=db.backref("watchlist_stocks", lazy = "dynamic"),cascade="all, delete")
    # watchlist_stocks = db.relationship("Stock",secondary="watchlist_stocks",cascade="all, delete")
    watchlist_stocks = db.relationship("Stock",secondary="watchlist_stocks")


    def to_dict(self):
        return {
            'id':self.id,
            'name':self.name,
            'owner':self.owner,
            'stocks':[{"name":watchlist_stock.name,"symbol":watchlist_stock.symbol} for watchlist_stock in self.watchlist_stocks]
        }

    def get_stocks(self):
        return {
            'id':self.id,
            'name':self.name,
            'stocks':[{"name":watchlist_stock.name,"symbol":watchlist_stock.symbol} for watchlist_stock in self.watchlist_stocks]
        }
