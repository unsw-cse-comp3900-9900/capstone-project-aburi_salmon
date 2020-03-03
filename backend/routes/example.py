from flask_restx import Resource, abort, reqparse, fields
from flask import request, jsonify

from app import api, db
from model.response_model import example_model

example = api.namespace('example', description='Example route')

@example.route("/", strict_slashes=False)
class ExampleRoute(Resource):
    @example.response(200, 'Success')
    def get(self):
        result = db.return_number(1)
        return "Hello there " + str(result)

    @example.expect(example_model)
    def post(self):
        return