from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db, Watchlist, Stock
from app.forms import WatchlistForm

watchlist_routes = Blueprint('watchlists', __name__)



@watchlist_routes.route('',methods=["POST"])
@login_required
def add_watchlist():
    form = WatchlistForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit):
        watchlist = Watchlist(
            name = form.data['name'],
            user_id = form.data['user_id']
        )
        db.session.add(watchlist)
        db.session.commit()
        user = User.query.get(watchlist.user_id)
        return user.to_dict()
    else: return None


@watchlist_routes.route('/<int:id>',methods=["DELETE"])
@login_required
def delete_watchlist(id):
    watchlist = Watchlist.query.get(id)
    # db.session.delete(watchlist)
    # db.session.commit()
    watchlist.watchlist_stocks = []
    db.session.delete(watchlist)
    db.session.commit()

    user = User.query.get(watchlist.user_id)
    print("\n\n\n\n\n\n\n\n\n\n BEFORE TO DICT \n\n\n\n\n\n ")
    print(f"\n\n\n\n\n\n\n\n\n {user.to_dict()} \n\n\n\n\n\n\n")
    return user.to_dict()


@watchlist_routes.route('/<int:id>',methods=["PUT"])
@login_required
def edit_watchlist(id):
    watchlist = Watchlist.query.get(id)
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit):
        watchlist.name = form.data['name'],
        watchlist.user_id = form.data['user_id']
        db.session.commit()
        user = User.query.get(watchlist.user_id)
        return user.to_dict()

    else: return None

@watchlist_routes.route('/<int:id>',methods=["POST"])
@login_required
def add_to_watchlist(id):
    symbol = request.json['symbol']
    watchlist = Watchlist.query.get(id)
    stock = Stock.query.filter_by(symbol=symbol).first()
    if(stock is None):
        stock = Stock(symbol=symbol,name=symbol)
        db.session.add(stock)
        db.session.commit()
    print(f"\n\n\n\n\n\n {watchlist} \n\n\n\n ")
    watchlist.watchlist_stocks.append(stock)
    print(f"\n\n\n\n\n\n {watchlist} \n\n\n\n {watchlist.watchlist_stocks} \n\n\n\n {stock} \n\n\n\n\n")
    db.session.commit()
    user = User.query.get(watchlist.user_id)
    return user.to_dict()



@watchlist_routes.route("/<int:id>/stocks/<string:symbol>",methods=["DELETE"])
@login_required
def delete_from_watchlist(id,symbol):
    user_id = request.json['user_id']
    watchlist = Watchlist.query.get(id)
    for i in range (len(watchlist.watchlist_stocks)):
        if(watchlist.watchlist_stocks[i].symbol == symbol):
            index = i
    watchlist.watchlist_stocks.pop(index)
    db.session.commit()
    user = User.query.get(user_id)
    return user.to_dict()
