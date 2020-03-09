import pdb

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.response_model import example_model

example = api.namespace('example', description='Example route')

@example.route("/", strict_slashes=False)
class ExampleRoute(Resource):
    @example.response(200, 'Success', model=example_model)
    def get(self):
        result = db.return_number(1)
        return "Hello there " + str(result)

    def post(self):
        return

@example.route("/protected", strict_slashes=False)
class ProtectedRoute(Resource):
    @jwt_required
    def get(self):
        # Get roles from JWT
        # This roles field will be useful when there's a protected endpoint
        claim = get_jwt_claims().get('roles')
        return claim
