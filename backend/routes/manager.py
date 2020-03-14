import pdb

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import registration_model

manager = api.namespace('manager', description='Manager Route')

@manager.route("/registration", strict_slashes=False)
class Registration(Resource):
    @jwt_required
    @manager.response(200, 'Success')
    @manager.expect(registration_model)
    def post(self):
        claim = get_jwt_claims().get('roles')
        print(claim)
        return claim

    def get(self):
        pass


