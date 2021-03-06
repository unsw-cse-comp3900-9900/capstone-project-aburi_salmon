import os
import pdb

from flask import Flask, request
from flask_restx import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from model.dbconfig import DbConfig
from db.interface import DB
#from db.order_db import order_DB
import config

# Init Flask object
flask_app = Flask(__name__)

dbConfig = DbConfig(config.DB_HOST, config.DB_PORT, config.DB_DATABASE, config.DB_USER, config.DB_PASSWORD)

# Enable httponly cookie
flask_app.config['JWT_TOKEN_LOCATION'] = ['cookies']
# Never expires
flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
# Persistent
flask_app.config['JWT_SESSION_COOKIE'] = False
# Enable CORS
flask_app.config['JWT_COOKIE_CSRF_PROTECT'] = False
CORS(flask_app, supports_credentials=True)
# With secret on JWT_SECRET_KEY
flask_app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY


## Exported variables to routes
api = Api(flask_app)
db = DB(dbConfig)
#order_db = order_DB(dbConfig)
jwt = JWTManager(flask_app)

def run_app(host, port):
    ## This is where routes are imported, and then app is run here
    import routes.auth
    import routes.menu
    import routes.order
    import routes.table
    import routes.staff_profiles
    import routes.stats

    from util.socket import socket
    socket.run(flask_app, host=host, port=port, debug=True)


if 'HOST' in os.environ:
    print()
    print('***')
    print('*** Current backend is served on: http://{}:{}'.format(
        os.environ['HOST'], os.environ['PORT']))
    print('***')
    print()
