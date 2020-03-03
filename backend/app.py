import os
from flask import Flask, request
from flask_restx import Api
from flask_cors import CORS

from model.dbconfig import DbConfig
from db.interface import DB
import config

# Init Flask object
flask_app = Flask(__name__)
# Set CORS
CORS(flask_app)

dbConfig = DbConfig(config.DB_HOST, config.DB_PORT, config.DB_DATABASE, config.DB_USER, config.DB_PASSWORD)

## Exported variables
api = Api(flask_app)
db = DB(dbConfig)


## When Authorization is enabled, uncomment this
# authorization = {
#     'authtoken': {
#         'type': 'apiKey',
#         'in': 'header',
#         'name': 'AUTH-TOKEN'
#     }
# }
# api = Api(app, authorizations=authorization)

def run_app(host, port):
    ## This is where routes are imported, and then app is run here
    ## Example routes
    import routes.example

    ## When SocketIO is enabled, comment this
    flask_app.run(host=host, port=port, debug=True)

    ## and uncomment these
    # from pubsub.socket import socket
    # socket.run(flask_app, host=host, port=port, debug=True)


if 'HOST' in os.environ:
    print()
    print('***')
    print('*** Current backend is served on: http://{}:{}'.format(
        os.environ['HOST'], os.environ['PORT']))
    print('***')
    print()
