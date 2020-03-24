from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api
from model.response_model import session_model, EnumUserType

session = api.namespace('session', description='Example route')

# First endpoint to call to check the session of the user
@session.route("/", strict_slashes=False)
class Session(Resource):
    @session.response(200, 'Success', model=session_model)
    @session.response(401, 'User is not attached to any session')
    @jwt_required
    def get(self):
        role_claim = get_jwt_claims().get('role')
        order_claim = get_jwt_claims().get('order')

        if role_claim is None and order_claim is None:
            abort(401, 'User is not attached to any session')
        if role_claim is not None:
            return jsonify({
                'user_type': 'STAFF',
                'identifier': role_claim
            })

        return jsonify(
            {
                'user_type': 'TABLE',
                'identifier': order_claim
            }
        )

# Attach table number in JWT token when reserving a table, and clear when table has finished
@session.route("/table", strict_slashes=False)
class Table(Resource):
    @session.response(200, 'Success')
    def post(self):
        pass

    def delete(self):
        pass
