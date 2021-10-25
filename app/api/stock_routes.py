from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Stock

stock_routes = Blueprint("stocks",__name__)

@stock_routes.route("")
def get_stocks():
    stocks = Stock.query.all()
    print("HERE: ",stocks)
    print("THERE: ",[stock.to_dict() for stock in stocks])
    return {"stocks":[stock.to_dict() for stock in stocks]}
