import re

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db, profile_db
from model.request_model import edit_staff_model, delete_staff_model

staff_profile = api.namespace('staff_profile', description='Staff''s Profile Route')

@staff_profile.route('/staff_list')
class Staff_list(Resource):
    #@jwt_required
    @staff_profile.response(200, 'Success')
    @staff_profile.response(400, 'Invalid request')
    def get(self):

        # Gets lists of staffs and all their details
        staff_list = profile_db.get_all_staff()
        return { 'staff_list': staff_list }


@staff_profile.route('/edit')
class Staff_edit(Resource):
    #@jwt_required
    @staff_profile.expect(edit_staff_model)
    @staff_profile.response(200, 'Success')
    @staff_profile.response(400, 'Invalid request')
    def patch(self):

        # Edit staff details
        edit_staff_input = request.get_json()               # get json input for new details
        staff_id = edit_staff_input.get('staff_id')
        name_new = edit_staff_input.get('name')
        username_new = edit_staff_input.get('username')
        staff_type_id_new = edit_staff_input.get('staff_type_id')

        staff_curr = profile_db.get_staff_detail(staff_id)  # get the current staff's details
        curr_name = staff_curr['name']
        curr_username = staff_curr['username']
        curr_staff_type_id = staff_curr['staff_type']

        if staff_id == 0:
            abort(400, 'Please insert a staff id.')

        # if user doesn't input new name OR username OR staff_type_id, use old (current) ones
        if name_new == 'string':
            name = curr_name
        else:
            name = name_new

        regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
        if(regex.search(name) != None):                     # name cannot contain any special characters
            abort(400, 'Malformed request, name cannot have special characters')

        if username_new == 'string':
            username = curr_username
        else:
            username = username_new
        
        if staff_type_id_new == 0:
            staff_type = curr_staff_type_id
        else:
            staff_type = staff_type_id_new
        
        edit = profile_db.modify_staff(staff_id, name, username, staff_type)
    
        if edit != 1:
            abort(400, 'Something is wrong.')
        
        response = jsonify({
            'status': 'success'
        })

    #@jwt_required
    @staff_profile.expect(delete_staff_model)
    @staff_profile.response(200, 'Success')
    @staff_profile.response(400, 'Invalid request')
    def delete(self):

        # Delete staff record
        delete_order = request.get_json()                   # get staff_id to be deleted from json input
        staff_id = delete_order.get('staff_id')

        if staff_id == 0:
            abort(400, 'Please insert staff id.')

        delete = profile_db.delete_staff(staff_id)

        if delete != 1:
            abort(400, 'Something is wrong.')

        response = jsonify({
            'status': 'success'
        })
