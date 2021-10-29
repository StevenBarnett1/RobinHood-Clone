from .db import db



class Holding(db.Model):
    __tablename__ = "holdings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"), nullable = False)
    stock_id = db.Column(db.Integer, db.ForeignKey("stocks.id"), nullable = False)
    shares = db.Column(db.Float,nullable=False)

    users = db.relationship("User",backref=db.backref("holdings",cascade="all, delete"))
    stock = db.relationship("Stock",backref=db.backref("holdings", lazy = "dynamic"))


    def to_dict(self):
        return{
            "id":self.id,
            "name":self.stock.name,
            "symbol":self.stock.symbol,
            "shares":self.shares
        }
