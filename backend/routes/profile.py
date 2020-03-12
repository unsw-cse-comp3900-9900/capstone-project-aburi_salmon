import pdb

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies

import config
from app import api, db
from model.request_model import *
from util.hasher import hash_password
from util.user import User

profile = api.namespace('profile', description='Example route')

@auth.route('/profile', strict_slashes=False)
class Profile(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request. Missing email')
    @auth.response(404, 'User not found.')
    def get(self):
       # print('Get request received')
       # print(request)
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')
        

#get the username from example.py
        profile = db.get_profile(username)


        return jsonify(profile)



        return {
            "username": db.get_usernamename(username)
            "name": db.get_name(username)
            "staff_type_id": db.get_staff_type_id(username)
        }











        email = request.get_json().get('email')
        print(email)
        if email is None:
            abort(400, 'Malformed request, missing email')

        print("Request was successful but...")

        if db.available_email(email):
            abort(404, 'User not found.')
        
        return {
            "displayname": db.get_displayname(email)
        }






@auth.route('/edit', strict_slashes=False)
class Profile(Resource):
    @auth.response(200, 'Success')
    @auth.response(400, 'Malformed request. Missing email')
    @auth.response(404, 'User not found.')
    @auth.expect(edit_profile_model)
    def post(self):
       # print('Get request received')
       # print(request)
        if not request.json:
            abort(400, 'Malformed request, format is not application/json')
        

        creds = request.get_json()
        new_name = creds.get('name')
        new_username = creds.get('username')
        new_staff_type_id = creds.get('staff_type_id')

        profile = db.get_profile(username)
        profile.name = new_name
        profile.username = new_username

        #update query in interface.py
