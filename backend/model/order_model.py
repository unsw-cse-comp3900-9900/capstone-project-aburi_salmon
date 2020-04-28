from flask_restx import fields

from app import api

customer_order_response_model = api.schema_model('Customer-Order-Response-Model', {
    "type": "object",
    "required": ["item_order", "total_bill", "bill_request"],
    "properties": {
        "item_order": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    'id': { "type": "integer" },
                    'order_id': { "type": "integer" },
                    'item': { "type": "string" },
                    'item_id': { "type": "integer" },
                    'quantity': { "type": "integer" },
                    'price': { "type": "number" },
                    'comment': { "type": "string" },
                    'status': {
                        "type": "object",
                        "required": ["id", "name"],
                        "properties": {
                            'id': { "type": "integer" },
                            'name': { "type": "string" }
                        }
                    }
                }
            }
        },
        "total_bill": { "type": "number" },
        "bill_request": { "type": "boolean" }
    }
})


order_request_model = api.schema_model('Order-Request-Model', {
    'type': 'object',
    'required': ['new_orders'],
    'properties': {
        'order': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['item_id', 'quantity'],
                'properties': {
                    'item_id': { 'type': 'integer' },
                    'quantity': { 'type': 'integer' },
                    'comment': { 'type': 'string' }
                }
            }
        }
    }
})

item_order_request_model = api.model('Item-Order-Request-Model', {
    "item_id": fields.Integer(description="item_id"),
    "quantity": fields.Integer(description="quantity"),
    "comment": fields.String(description="Comment")
})

create_item_order_response_model = api.schema_model('Item-Order-Response-Model', {
    "type": "object",
    "required": ["status", "id"],
    "properties": {
        "status": { "type": "string", "const": "success" },
        "id": { "type": "integer" }
    }
})

delete_item_order_request_model = api.model('Delete-Item-Order-Request-Model', {
    "id": fields.Integer(description="item_order_id")
})

edit_item_order_status_request_model = api.model('Edit-Item-Order-Status-Request-Model', {
    "status": fields.Integer(description="status_id")
})

item_order_response_model = api.schema_model('Item-Order-Response-Model', {
    'type': 'object',
    'required': ['itemList', 'table'],
    'properties': {
        'table': {'type': 'integer'},
        'itemList': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['itemName','quantity','price','id'],
                'properties': {
                    'itemName': {'type': 'string'},
                    'quantity': {'type': 'integer'},
                    'price': {'type': 'number'},
                    'id': {'type': 'integer'},
                    'status_id': {'type': 'integer'},
                }
            }
        }
    }
})

item_order_status_response_model = api.schema_model('Item-Order-Status-Response-Model', {
    'type': 'object',
    'required': ['itemList'],
    'properties': {
        'itemList': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['itemName','quantity','price','id','table'],
                'properties': {
                    'itemName': {'type': 'string'},
                    'quantity': {'type': 'integer'},
                    'price': {'type': 'number'},
                    'id': {'type': 'integer'},
                    'status_id': {'type': 'integer'},
                    'table': {'type': 'integer'}
                }
            }
        }
    }
})

order_time_request_model = api.model('Order-Time-Request-Model', {
    "order_id": fields.Integer(description="order_id")
})

order_time_response_model = api.model('Order-Time-Response-Model', {
    "estimated_time": fields.Integer(description="estimated wait time for order")
})