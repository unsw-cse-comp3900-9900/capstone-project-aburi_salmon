from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

import uuid

from app import api, db
from model.request_model import StaffType

manager = api.namespace('manager', description='Manager Route')

@manager.route("/registration", strict_slashes=False)
class Registration(Resource):
    @jwt_required
    @manager.response(200, 'Success')
    @manager.response(400, 'Invalid request')
    @manager.response(401, 'User is not a manager')
    def post(self):
        role_claim = get_jwt_claims().get('role')
        if (role_claim != StaffType.MANAGER.value):
            return 'Not the manager', 401

        registration_key = uuid.uuid4().hex
        db.add_registration_key(registration_key)

        return 'Success'
        

    @jwt_required
    @manager.response(200, 'Success')
    @manager.response(401, 'User is not a manager')
    def get(self):
        pass


