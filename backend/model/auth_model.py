from flask_restx import fields

from app import api

login_request_model = api.model('Login-Request-Model', {
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password')
})


login_response_model = api.schema_model('Login-Response-Model', {
    "type": "object",
    "required": ["status", "stafftype"],
    "properties": {
        "status": {
            "type": "string",
            "const": "success"
        },
        "stafftype": {
            "type": "integer",
            "enum": [1,2,3]
        }
    }
})

signup_request_model = api.model('Signup-Request-Model', {
    "name": fields.String(description='Name'),
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password'),
    "registration_key": fields.String(description='Registration_Key')
})

single_registration_response_model = api.schema_model('Single-Registration-Response-Model', {
    "type": "object",
    "required": ["key", "staff_name", "staff_id"],
    "properties": {
        "key": { "type": "string" },
        "staff_name": { "type": "string" },
        "staff_id": { "type": "integer" }
    }
})

registration_response_model = api.schema_model('Registration-Response-Model', {
    "type": "object",
    "required": ["registration_keys"],
    "properties": {
        "registration_keys": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Single-Registration-Response-Model"
            }
        }
    }
})

registration_request_model = api.model('Registration-Request-Model', {
    "type": fields.String(description='Name of staff type'),
    "key": fields.String(description='new registration key for that staff type')
})

customer_session_request_model = api.model('Customer-Session-Request-Model', {
    'table': fields.Integer(description='Table number of new order')
})