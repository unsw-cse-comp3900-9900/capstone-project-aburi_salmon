import pdb
import re

from uuid import uuid4
from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_socketio import join_room, leave_room
from util.socket import socket
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, jwt_optional, get_jwt_identity, get_jwt_claims

import config
from app import api, db
from db.auth_db import auth_DB
import model.auth_model as auth_model
from util.hasher import hash_password
from util.user import User

auth_db = auth_DB(db)
auth = api.namespace('auth', description='Authentication route')

@auth.route("/login", strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success', model=auth_model.login_response_model)
    @auth.expect(auth_model.login_request_model)
    def post(self):
        creds = request.get_json()
        username = creds.get('username')
        payload_password = creds.get('password')

        if username is None or payload_password is None:
            abort(400, 'Malformed request, email and password is not supplied')
        
        # Hash the password when everything works fine with plain password. This is how you hash the password, in a simple way:
        db_password = hash_password(payload_password)

        if auth_db.login(username, db_password) == False:
            abort(401, 'Invalid email/password combination')

        # Create identity for session, by using User object with role = 1 and table = None
        # Change this so that the role follows the staff_type_id of the user
        identity = User(username, auth_db.get_profile(username).get('staff_type_id'), None)
        staff_type =  auth_db.get_profile(username).get('staff_type_id')
        access_token = create_access_token(identity=identity)
        
        print('User {} has logged in'.format(username))

        response = jsonify({
            'status': 'success', 
            'staffype' : staff_type
        })
        set_access_cookies(response, access_token)

        return response

@auth.route("/logout", strict_slashes=False)
class Logout(Resource):
    @jwt_optional
    @auth.response(200, 'Success')
    def post(self):
        current_user = get_jwt_identity()
        if current_user:
            print('User {} has logged out'.format(current_user))

        response = jsonify({
            'status': 'success'
        })
        # Unset JWT cookie to log the user out
        unset_jwt_cookies(response)
        return response


@auth.route("/signup", strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request')
    @auth.response(409, 'Username is already taken')
    @auth.expect(auth_model.signup_request_model)
    def post(self):
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')

        # Extract data from json payload
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
        
        if not auth_db.available_username(username):
            abort(409, 'Username \'{}\' is taken'.format(username))

        if(regex_name.search(name) != None): 
            abort(400, 'Malformed request, name should only contain a-z, A-Z, and space')

        if(regex_username.search(username) != None): 
            abort(400, 'Malformed request, username should only contain a-z, A-Z, 0-9, and underscore')
        
        if registration_key is None:
            abort(400, 'Malformed request, registration key is not supplied')

        if len(payload_password) < 8:
            abort(400, 'Minimum length of password is 8')

        # Validate the registration key
        staff_type_id = auth_db.validate_key(registration_key)
        if (not staff_type_id):
            abort(403, 'Invalid registration key')

        # Hash the password
        db_password = hash_password(payload_password)

        # Create a new user in the database
        reg = auth_db.register(username, db_password, name, staff_type_id)

        if reg is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your username is unique.')

        print('New user {} signed-up'.format(username))

        response = jsonify({
            'status': 'success'
        })

        return

@auth.route("/registration", strict_slashes=False)
class Registration(Resource):
    @jwt_required
    @auth.response(200, 'Success', auth_model.registration_response_model)
    @auth.response(400, 'User is not a manager')
    def get(self):
        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Get a list of all registration keys
        keys = auth_db.get_registration_keys(None)
        return jsonify({ 'registration_keys': keys })


    @jwt_required
    @auth.expect(auth_model.registration_request_model)
    @auth.response(200, 'Success')
    @auth.response(400, 'Invalid request')
    @auth.response(500, 'Something went wrong')
    def put(self):
        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Extract the staff type and new registration key from the request body
        body = request.get_json()
        staff = body.get('type')
        key = body.get('key')

        if (not staff or not key):
            abort(400, 'Invalid request')

        # Set the new key in the database
        if (auth_db.set_registration_key(key, staff) is None):
            abort(500, 'Something went wrong.')

        print('Registration key for staff_type {} has been changed.'.format(staff))
        return jsonify({ 'status': 'success' })

@auth.route("/registration/<int:staff_type>", strict_slashes=False)
class RegistrationList(Resource):
    @jwt_required
    @auth.response(200, 'Success', model=auth_model.single_registration_response_model)
    @auth.response(400, 'User is not a manager')
    @auth.response(500, 'Something went wrong')
    def get(self, staff_type):
        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Get the registration key of for a given staff type
        keys = auth_db.get_registration_keys(staff_type)
        if (not keys[0]):
            abort(500, 'Something went wrong')
        return jsonify(keys[0])

@auth.route("/customer/login", strict_slashes=False)
class CustomerSession(Resource):
    # Note: To remove the customer order session, just use the logout route
    # Create a session cookie for a customer
    # This will occupy the table
    @auth.response('200', 'Success')
    @auth.response('400', 'Invalid Request')
    @auth.expect(auth_model.customer_session_request_model)
    def post(self):
        # Extract selected table from request body
        table = request.get_json().get('table')

        print('Table is {}'.format(table))

        if (table is None):
            abort(400, 'Table number not provided')

        print('Select table ' + str(table))
        # Set the table as 'taken' in the database
        if (not auth_db.selectTable(table)):
            print('Table ' + str(table) + ' is taken')
            abort(400, 'Table is taken')
        print('Table selected')

        print('Creating order item')
        # Create a new order record
        order_id = auth_db.insert_order(table)
        print('Order id = ' + str(order_id))

        if not order_id:
            print("Failed to create order item for new customer")
            abort(500, "Something went wrong")

        # Create an identity for the customer (with the id of the new order record)
        identity = User('Customer', None, order_id)

        response = jsonify({
            'status': 'success'
        })

        # Set the customer's JWT cookie with the identity 
        access_token = create_access_token(identity=identity)
        set_access_cookies(response, access_token)
        
        return response

@auth.route("/customer/logout", strict_slashes=False)
class CustomerLogoutSession(Resource):
    @jwt_required
    @auth.response('200', 'Success')
    def post(self):
        order_id = get_jwt_claims().get('order')
        print('Customer with otder_id {} has logged out'.format(order_id))

        response = jsonify({
            'status': 'success'
        })
        unset_jwt_cookies(response)
        return response

