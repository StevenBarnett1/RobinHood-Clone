from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db, Watchlist
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
    else: return None


@watchlist_routes.route('/<int:id>',methods=["DELETE"])
@login_required
def delete_watchlist(id):
    watchlist = Watchlist.query.get(id)
    db.session.delete(watchlist)
    db.session.commit()


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
    else: return None
