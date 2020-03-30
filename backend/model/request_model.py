import enum

from flask_restx import fields

from app import api

# This is for request payload that you can see in Swagger documentation

login_model = api.model('login', {
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password')
})

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

new_order_model = api.schema_model('new_order_model', {
    'type': 'object',
    'required': ['new_orders'],
    'properties': {
        'new_orders': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['item_id', 'quantity'],
                'properties': {
                    'item_id': { 'type': 'integer' },
                    'quantity': { 'type': 'integer' }
                }
            }
        }
    }
})

modify_order_model = api.model('modify_order_model', {
    "item_order_id": fields.Integer(description="item_order_id"),
    "quantity": fields.Integer(description="quantity")
})

delete_order_model = api.model('delete_order_model', {
    "item_order_id": fields.Integer(description="item_order_id")
})

registration_model = api.model('registration_model', {
    "type": fields.Integer(description='staff_type id')
})

menu_item_model = api.model('menu_item_model', {
    'name': fields.String(description='name of new menu item'),
    'description': fields.String(description='description of new menu item'),
    'price': fields.Float(description='price of the new item'),
    'visible': fields.Boolean(description='is the item visible on the menu')
})

category_model = api.model('category_model', {
    'name': fields.String(description='category name'),
    'position': fields.Integer(description='position to show the category')
})

add_item_to_category_model = api.model('add_item_to_category_model', {
    'position': fields.Integer(description='position to show the item in the category')
})

ingredient_model = api.model('ingredient_model', {
    'name': fields.String(description='ingredient name')
})

customer_session_model = api.model('customer_session_mode', {
    'table': fields.Integer(description='Table number of new order')
})

table_model = api.model('table_model', {
    'table': fields.Integer(description='New table number')
})

table_assistance_model = api.model('table_assistance_model', {
    'assistance': fields.Boolean(description='The assistance status of a table session')
})

edit_staff_model = api.model('edit_staff_model', {
    "staff_id": fields.Integer(description="staff_id"),
    "name": fields.String(description='Name'),
    "username": fields.String(description='Username'),
    "staff_type_id": fields.Integer(description='Staff_type_id')
})

delete_staff_model = api.model('delete_staff_model', {
    "staff_id": fields.Integer(description="staff_id")
})