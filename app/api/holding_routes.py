from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stock, Holding, db
from app.forms import HoldingForm

holding_routes = Blueprint("holdings",__name__)


@holding_routes.route("",methods=["POST"])
def post_holding():
    form = HoldingForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"\n\n\n\n SYMBOL HERE {request.json['symbol']}\n\n\n\n")
    symbol = request.json['symbol']
    if(form.validate_on_submit and symbol is not None):
        stock = Stock.query.filter_by(symbol=symbol).first()
        holding = Holding(
            stock_id = stock.id,
            user_id = form.data['user_id'],
            shares = form.data['shares']
        )
        db.session.add(holding)
        db.session.commit()
    return {}
