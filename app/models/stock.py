from .db import db


class Stock(db.Model):
    __tablename__ = 'stocks'

    name = db.Column(db.String(255),nullable=False, unique = True)
    symbol = db.Column(db.String(10),nullable=False,unique = True)


    def to_dict(self):
        return {
            'id':self.id,
            'symbol':self.symbol,
            'name':self.name
        }
