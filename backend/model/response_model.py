import enum

from flask_restx import fields

from app import api

# This is for responses that you can see in Swagger documentation

example_model = api.model('example', {
    "example_key": fields.String(description='Put value for this')
})

class EnumUserType(enum.Enum):
    STAFF = 'STAFF'
    TABLE = 'TABLE'

session_model = api.model('session', {
    "user_type": fields.String(description="Check the user type of the session as a string", enum=EnumUserType._member_names_),
    "identifier": fields.Integer(description="Identifier of the session, might be staff type id or table number")
})

tables_model = api.schema_model('tables', {
    'type': 'object',
    'required': ['tables'],
    'properties': {
        'tables': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['table_id', 'occupied'],
                'properties': {
                    'table_id': { 'type': 'integer' },
                    'occupied': { 'type': 'boolean' }
                }
            }
        }
    }
})