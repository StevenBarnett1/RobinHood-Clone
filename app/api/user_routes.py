from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db, Watchlist
from app.forms import WatchlistForm
from app.api.auth_routes import validation_errors_to_error_messages

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>',methods=["PUT"])
@login_required
def add_buying_power(id):
    user = User.query.get(id)
    print(f"\n\n\n{request.json['buyingPower']}\n\n\n")
    user.buying_power = float(user.buying_power) + float(request.json['buyingPower'])
    print(f"\n\n\n\n{user.buying_power}\n\n\n\n")
    db.session.commit()
    return user.to_dict()

# @user_routes.route('/<int:user_id>/watchlists',methods=["POST"])
# @login_required
# def add_watchlist(user_id):
#     form = WatchlistForm()
#     user = User.query.get(user_id)
#     print(f"\n\n\n before {user.to_dict()} \n\n\n\n")
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if(form.validate_on_submit):
#         watchlist = Watchlist(
#             name = form.data['name'],
#             user_id = user_id
#         )
#         db.session.add(watchlist)
#         db.session.commit()
#         user = User.query.get(user_id)
#         print(f"\n\n\n after {user.to_dict()} \n\n\n\n")
#         return None
#     else:
#         print("\n\n\n\n\n\n\n\n\n\n Form did not validate \n\n\n\n\n\n\n\n\n\n\n\n")
#     # return {'errors': validation_errors_to_error_messages(form.errors)}, 401
