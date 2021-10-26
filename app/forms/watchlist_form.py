from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


class WatchlistForm(FlaskForm):
    name = StringField("name", validators = [DataRequired()])
    user_id = StringField("user_id",validators = [DataRequired()])
