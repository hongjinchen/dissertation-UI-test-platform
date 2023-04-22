import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:chen526@localhost/UI_test'
    SQLALCHEMY_TRACK_MODIFICATIONS = False