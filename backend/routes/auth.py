import pdb
import re

from uuid import uuid4
from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required

import config
from app import api, db
from model.request_model import login_model, signup_model, registration_model, customer_session_model
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
            staff_type_id = db.validate_key(registration_key)
            if (not staff_type_id):
                abort(403, 'Invalid registration key')

        # db_password = hash_password(payload_password)
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
    @auth.response(500, 'User is not a manager')
    def get(self):
        # Get a list of all registration keys
        keys = db.get_registration_keys(None)
        return jsonify({ 'registration_keys': keys })


    @jwt_required
    @auth.expect(registration_model)
    @auth.response(200, 'Success')
    @auth.response(400, 'Invalid request')
    @auth.response(500, 'Something went wrong')
    def post(self):
        # Create a new registration key for a given type of staff
        body = request.get_json()
        staff_type = body.get('type')

        if (not staff_type):
            abort(400, 'Invalid request')

        registration_key = uuid4().hex

        if (db.add_registration_key(registration_key, staff_type) is None):
            abort(500, 'Something went wrong.')

        return jsonify({ 'status': 'success' })

@auth.route("/registration/<int:id>", strict_slashes=False)
@auth.param('id', 'staff_type identifier')
class RegistrationList(Resource):
    @jwt_required
    @auth.response(200, 'Success')
    @auth.response(500, 'User is not a manager')
    def get(self, id):
        # Get a list of all registration keys of type 'id'
        keys = db.get_registration_keys(id)
        return jsonify({ 'registration_keys': keys })

@auth.route("/customer", strict_slashes=False)
class CustomerSession(Resource):
    # Note: To remove the customer order session, just use the logout route
    # Create a session cookie for a customer
    @auth.response('200', 'Success')
    @auth.response('400', 'Invalid Request')
    @auth.expect(customer_session_model)
    def post(self):
        table = request.get_json().get('table')

        if (not table):
            abort(400, 'Table number not provided')
        
        print('Creating order item')
        order_id = db.insert_order(table)
        print('Order id = ' + str(order_id))

        print('Select table ' + str(table))
        if (not db.selectTable(table)):
            print('Table ' + str(table) + ' is taken')
            abort(400, 'Table is taken')
        print('Table selected')

        identity = User('Customer', None, order_id)
        access_token = create_access_token(identity=identity)

        response = jsonify({
            'status': 'success'
        })

        set_access_cookies(response, access_token)

        return response


