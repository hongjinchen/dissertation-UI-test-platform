from flask_cors import CORS
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app, origins="http://localhost:3000")

db = SQLAlchemy(app)
login_manager = LoginManager(app)

from app import routes, models