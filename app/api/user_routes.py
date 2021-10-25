from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db

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
def edit_user(id):
    user = User.query.get(id)
    print(f"\n\n\n{request.json}\n\n\n")
    user.buying_power = request.json.buyingPower
    print(f"\n\n\n\n{user.buying_power}\n\n\n\n")
    db.session.commit()
    return user.to_dict()
