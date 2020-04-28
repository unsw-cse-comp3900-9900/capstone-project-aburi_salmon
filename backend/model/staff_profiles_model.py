from flask_restx import fields

from app import api

staff_list_response_model = api.schema_model('Staff-List-Response-Model', {
    "type": "object",
    "required": ["staff_list"],
    "properties": {
        "staff_list": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id", "name", "username", "staff_type"],
                "properties": {
                    "id": { "type": "integer" },
                    "name": { "type": "string" },
                    "username": { "type": "string" },
                    "staff_type": { "type": "string" }
                }
            }
        }
    }
})

edit_staff_request_model = api.model('Edit-Staff-Request-Model', {
    "staff_id": fields.Integer(description="staff_id"),
    "name": fields.String(description='Name'),
    "username": fields.String(description='Username'),
    "staff_type_id": fields.Integer(description='Staff_type_id')
})

delete_staff_request_model = api.model('Delete-Staff-Request-Model', {
    "staff_id": fields.Integer(description="staff_id")
})