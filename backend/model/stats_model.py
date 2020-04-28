from flask_restx import fields

from app import api

item_sale_response_model = api.schema_model('Item-Sale-Response-Model', {
    'type': 'object',
    'required': ['id', 'name', 'orders', 'price', 'revenue'],
    'properties': {
        'id': { 'type': 'integer' },
        'name': { 'type': 'string' },
        'orders': { 'type': 'integer' },
        'price': { 'type': 'number' },
        'revenue': { 'type': 'number' }
    }
})

sales_response_model = api.schema_model('Sales-Response-Model', {
    'type': 'object',
    'required': ['item_sales', 'total_revenue'],
    'properties': {
        'item_sales': {
            'type': 'array',
            'items': {
                "$ref": "#/definitions/Item-Sale-Response-Model"
            }
        },
        'total_revenue': { 'type': 'number' }
    }
})

category_sales_response_model = api.schema_model('Category-Sales-Response-Model', {
    'type': 'object',
    'required': ['category_sales'],
    'properties': {
        'category_sales': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['id','name','orders','revenue'],
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'orders': {'type': 'integer'},
                    'revenue': {'type': 'number'}
                }
            }
        }
    }
})

recommendations_response_model = api.schema_model('Recommendations_Response_Model', {
    'type': 'object',
    'required': ['recommendations'],
    'properties': {
        'recommendations': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['item_id', 'count', 'name'],
                'properties': {
                    'item_id': { 'type': 'integer' },
                    'count': { 'type': 'integer' },
                    'name': { 'type': 'string' }
                }
            }
        }
    }
})

recommendations_request_model = api.schema_model('Recommendations_Request_Model', {
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