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
    user = User.query.get(watchlist.user_id)
    db.session.delete(watchlist)
    db.session.commit()
    user = User.query.get(watchlist.user_id)
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
    watchlist.watchlist_stocks.append(stock)
    db.session.commit()
    user = User.query.get(watchlist.user_id)
    return user.to_dict()
