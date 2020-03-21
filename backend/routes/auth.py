import pdb
import re

from uuid import uuid4
from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required

import config
from app import api, db
from model.request_model import login_model, signup_model
from util.hasher import hash_password
from util.user import User

auth = api.namespace('auth', description='Authentication route')

@auth.route("/login", strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success')
    @auth.expect(login_model)
    def post(self):
        creds = request.get_json()
        username = creds.get('username')
        payload_password = creds.get('password')

        if username is None or payload_password is None:
            abort(400, 'Malformed request, email and password is not supplied')

        # Use plain password as example
        db_password = payload_password

        # Hash the password when everything works fine with plain password. This is how you hash the password, in a simple way:
        # db_password = hash_password(payload_password)

        if db.login(username, db_password) == False:
            abort(401, 'Invalid email/password combination')

        # Create identity for session, by using User object with role = 1 and table = None
        # Change this so that the role follows the staff_type_id of the user
        identity = User(username, db.get_profile(username).get('staff_type_id'), None)
        access_token = create_access_token(identity=identity)

        response = jsonify({
            'status': 'success'
        })
        set_access_cookies(response, access_token)
        return response

@auth.route("/logout", strict_slashes=False)
class Logout(Resource):
    def post(self):
        response = jsonify({
            'status': 'success'
        })
        unset_jwt_cookies(response)
        return response


@auth.route("/signup", strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request')
    @auth.response(409, 'Username is already taken')
    @auth.expect(signup_model)
    def post(self):
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')

        creds = request.get_json()
        name = creds.get('name')
        username = creds.get('username')
        payload_password = creds.get('password')
        registration_key = creds.get('registration_key')
        # staff_type_id = creds.get('staff_type_id')

        # Name only allows a-z, A-Z, and space
        regex_name = re.compile('[^a-zA-Z\s]')

        # Username only allows a-z, A-Z, 0-9, and underscore
        regex_username = re.compile('[^a-zA-Z0-9_]')

        if username is None or payload_password is None or name is None:
            abort(400, 'Malformed request, username or password or name is not supplied')
        
        if not db.available_username(username):
            abort(409, 'Username \'{}\' is taken'.format(username))

        if(regex_name.search(name) != None): 
            abort(400, 'Malformed request, name should only contain a-z, A-Z, and space')

        if(regex_username.search(username) != None): 
            abort(400, 'Malformed request, username should only contain a-z, A-Z, 0-9, and underscore')
        
        if registration_key is None:
            abort(400, 'Malformed request, registration key is not supplied')

        if len(payload_password) < 8:
            abort(400, 'Minimum length of password is 8')

        if registration_key == "staff1":
            staff_type_id = 1
        elif registration_key == "staff2":
            staff_type_id = 2
        elif registration_key == "staff3":
            staff_type_id = 3
        else:
            abort(403, 'Wrong registration key')

        #if db.validate_key(registration_key):
        #    abort(403, 'Registration key mismatch')

        #db_password = hash_password(payload_password)
        db_password = payload_password

        reg = db.register(username, db_password, name, staff_type_id)

        if reg is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your username is unique.')

        response = jsonify({
            'status': 'success'
        })

        return

@auth.route("/registration", strict_slashes=False)
class Registration(Resource):
    @jwt_required
    @auth.response(200, 'Success')
    @auth.response(400, 'Invalid request')
    @auth.response(401, 'User is not a manager')
    def post(self):
        role_claim = get_jwt_claims().get('role')

        registration_key = uuid.uuid4().hex

        try:
            db.add_registration_key(registration_key)
        except Exception as e:
            print('Something went wrong')
            print(e)
            abort(500, 'Something went wrong.')

        return jsonify({ 'status': 'success' })
        

    @jwt_required
    @auth.response(200, 'Success')
    @auth.response(401, 'User is not a manager')
    def get(self):
        pass
