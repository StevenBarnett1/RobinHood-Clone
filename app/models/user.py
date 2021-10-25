from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255),nullable=False)
    last_name = db.Column(db.String(255),nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    buying_power = db.Column(db.Float, nullable=False, default=0)
    hashed_password = db.Column(db.String(255), nullable=False)

    watchlists = db.relationship("Watchlist",back_populates="owner",cascade="all, delete")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'buying_power':self.buying_power,
            'first_name':self.first_name,
            'last_name':self.last_name,
            'watchlists':[ watchlist.get_stocks() for watchlist in self.watchlists],
            'holdings':[holding.to_dict() for holding in self.holdings]
        }
