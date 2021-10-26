from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db, Watchlist


watchlist_routes = Blueprint('watchlists', __name__)
