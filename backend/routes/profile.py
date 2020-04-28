import pdb
import re

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, get_jwt_claims, get_jwt_identity, jwt_required

import config
from app import api, db
from db.profile_db import profile_DB

import model.profile_model as profile_model
from model.request_model import edit_profile_model
from util.hasher import hash_password
from util.user import User

profile_db = profile_DB(db)
profile = api.namespace('profile', description='Profile route')


@profile.route("/profile", strict_slashes=False)
class GetProfile(Resource):
    @jwt_required
    def get(self):
        # Gets username from JWT
        curr_user = get_jwt_identity()   #username
        
        profile_dict = profile_db.get_profile(curr_user)
        curr_name = profile_dict['name']
        curr_staff_type_id =profile_dict['staff_type_id']

        print(curr_user)
        print(curr_name)
        print(curr_staff_type_id)

        return profile_dict

    @profile.expect(edit_profile_model)
    def post(self):
        profile_dict = self.get()
        curr_name = profile_dict['name']
        curr_staff_type_id =profile_dict['staff_type_id']

        if not request.json:
            abort(400, 'Malformed request, format is not application/json')

        creds = request.get_json()
        new_name = creds.get('name')
    #    new_username = creds.get('username')
        new_registration_key = creds.get('registration_key')
    #    staff_type_id = creds.get('staff_type_id')

        # Staff can only update their name and staff type
        username = profile_dict['username']

        if new_name is None:
            name = curr_name
        else:
            name = new_name

        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

        if(regex.search(name) != None): 
            abort(400, 'Malformed request, name cannot have special characters')

        if new_registration_key is None:
            staff_type_id = curr_staff_type_id
        else:
            if new_registration_key == "staff1":
                staff_type_id = 1
            elif new_registration_key == "staff2":
                staff_type_id = 2
            elif new_registration_key == "staff3":
                staff_type_id = 3
            else:
                abort(403, 'Wrong registration key')
        
        upd = profile_db.update_staff(username, name, staff_type_id)

        if upd is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed.')

        response = jsonify({
            'status': 'success'
        })

        return response
