from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Stock, Holding, db, User
from app.forms import HoldingForm

holding_routes = Blueprint("holdings",__name__)


@holding_routes.route("",methods=["POST"])
def post_holding():
    form = HoldingForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"\n\n\n\n SYMBOL HERE {request.json['symbol']}\n\n\n\n")
    user_id = request.json['user_id']
    symbol = request.json['symbol']
    if(form.validate_on_submit and symbol is not None):
        stock = Stock.query.filter_by(symbol=symbol).first()
        if(stock is None):
            stock = Stock(symbol=symbol,name=symbol)
            db.session.add(stock)
            db.session.commit()
        holding = Holding(
            stock_id = stock.id,
            user_id = form.data['user_id'],
            shares = form.data['shares']
        )
        found_holding = Holding.query.filter_by(stock_id=stock.id,user_id=holding.user_id).first()
        if(found_holding is not None):
            print(f"FOUND THE HOLDING \n\n\n\n\n {found_holding.to_dict()} \n\n\n\n\n\n")
            found_holding.shares = found_holding.shares + holding.shares
            db.session.commit()
        else:
            db.session.add(holding)
            db.session.commit()
        user = User.query.get(holding.user_id)
        return user.to_dict()
    else:
        user = User.query.get(user_id)
        return user.to_dict()



@holding_routes.route("",methods=["PUT"])
def sell_holding():
    form = HoldingForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"\n\n\n\n SYMBOL HERE {request.json['symbol']}\n\n\n\n")
    symbol = request.json['symbol']
    user_id = request.json['user_id']
    if(form.validate_on_submit and symbol is not None):
        stock = Stock.query.filter_by(symbol=symbol).first()
        holding = Holding(
            stock_id = stock.id,
            user_id = form.data['user_id'],
            shares = form.data['shares']
        )
        found_holding = Holding.query.filter_by(stock_id=stock.id,user_id=holding.user_id).first()
        if(found_holding is not None):
            print(f"FOUND THE HOLDING \n\n\n\n\n {found_holding.to_dict()} \n\n\n\n\n\n")
            found_holding.shares = found_holding.shares - holding.shares
            if(found_holding.shares == 0): db.session.delete(found_holding)
            db.session.commit()
    user = User.query.get(user_id)
    return user.to_dict()
