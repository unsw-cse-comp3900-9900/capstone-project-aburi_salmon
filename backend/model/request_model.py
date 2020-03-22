import enum

from flask_restx import fields

from app import api

# This is for request payload that you can see in Swagger documentation

login_model = api.model('login', {
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password')
})

class StaffType(enum.Enum):
    WAIT = 1
    KITCHEN = 2
    MANAGER = 3

signup_model = api.model('signup', {
    "name": fields.String(description='Name'),
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password'),
    "registration_key": fields.String(description='Registration_Key')
#    "staff_type_id": fields.Integer(description='Staff_type_id')
})

edit_profile_model = api.model('edit_profile', {
    "name": fields.String(description='Name'),
#    "username": fields.String(description='Username'),
    "registration_key": fields.String(description='Registration_Key')
#    "staff_type_id": fields.Integer(description='Staff_type_id')
})

edit_order_item_status_model = api.model('edit_order_item_status', {
    "id": fields.Integer(description="id"),
    "status": fields.Integer(description="status_id")
})

new_order_model = api.model('new_order_model', {
    "item_id": fields.Integer(description="item_id"),
    "quantity": fields.Integer(description="quantity")
})

modify_order_model = api.model('modify_order_model', {
    "item_id": fields.Integer(description="item_id"),
    "quantity": fields.Integer(description="quantity")
})

delete_order_model = api.model('delete_order_model', {
    "item_id": fields.Integer(description="item_id")
})
