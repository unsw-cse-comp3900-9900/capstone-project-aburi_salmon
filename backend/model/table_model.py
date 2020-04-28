from flask_restx import fields

from app import api

tables_response_model = api.schema_model('Tables-Response-Model', {
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

table_request_model = api.model('Table-Request-Model', {
    'table': fields.Integer(description='New table number')
})

table_order_response_model = api.schema_model('Table-Order-Response-Model', {
    'type': 'object',
    'required': ['table', 'order_id', 'items', 'total_cost'],
    'properties': {
        'table': { 'type': 'integer' },
        'order_id': {'type': 'integer' },
        'items': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['name', 'quantity', 'price'],
                'properties': {
                    'name': {'type': 'string'},
                    'quantity': {'type': 'integer'},
                    'price': {'type': 'number'}
                }
            },
        },
        'total_cost': {'type': 'number'}
    }
})

table_assistance_response_model = api.schema_model('Table-Assistance-Response-Model', {
    "type": "object",
    "required": ["tables"],
    "properties": {
        "tables": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["table_id", "occupied"],
                "properties": {
                    "table_id": { "type": "integer" },
                    "occupied": { "type": "boolean" }
                }
            }
        }
    }
})

table_assistance_request_model = api.model('Table-Assistance-Request-Model', {
    'assistance': fields.Boolean(description='The assistance status of a table session'),
    'table': fields.Integer(description='Optional field for table')
})

table_paid_response_model = api.schema_model('Table-Paid-Response=-Model', {
    'type': 'object',
    'required': ['tables'],
    'properties': {
        'tables': {
            'type': 'array',
            'items': { 'type': 'integer' }
        }
    }
})

table_paid_request_model = api.model('Table-Paid-Request-Model', {
    'paid': fields.Boolean(description='The payment status of a table session'),
    'table': fields.Integer(description='Table number')
})

table_bill_response_model = api.schema_model('Table-Bill-Response-Model', {
    'type': 'object',
    'required': ['tables'],
    'properties': {
        'tables': {
            'type': 'array',
            'items': { 'type': 'integer' }
        }
    }
})

table_bill_request_model = api.model('Table-Bill-Request-Model', {
    'bill': fields.Boolean(description='The payment status of a table session'),
    'table': fields.Integer(description='Optional field for table')
})