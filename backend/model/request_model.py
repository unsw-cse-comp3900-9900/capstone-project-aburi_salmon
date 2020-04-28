import enum

from flask_restx import fields

from app import api

# This is for request payload that you can see in Swagger documentation

edit_profile_model = api.model('edit_profile', {
    "name": fields.String(description='Name'),
#    "username": fields.String(description='Username'),
    "registration_key": fields.String(description='Registration_Key')
#    "staff_type_id": fields.Integer(description='Staff_type_id')
})

delete_order_model = api.model('delete_order_model', {
    "id": fields.Integer(description="item_order_id")
})

table_model = api.model('table_model', {
    'table': fields.Integer(description='New table number')
})

table_assistance_model = api.model('table_assistance_model', {
    'assistance': fields.Boolean(description='The assistance status of a table session'),
    'table': fields.Integer(description='Optional field for table')
})

table_paid_model = api.model('table_paid_mdoel', {
    'paid': fields.Boolean(description='The payment status of a table session'),
    'table': fields.Integer(description='Table number')
})

table_bill_model = api.model('table_paid_mdoel', {
    'bill': fields.Boolean(description='The payment status of a table session'),
    'table': fields.Integer(description='Optional field for table')
})

recommendations_model = api.schema_model('recommendations_model', {
    'type': 'object',
    'required': ['items'],
    'properties': {
        'items': {
            'type': 'array',
            'items': {
                'type': 'integer'
            }
        }
    }
})