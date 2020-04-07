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

menu_item_model = api.schema_model('item', {
    'type': 'object',
    'required': ['id', 'name', 'description', 'price', 'visible'],
    'properties': {
        'id': { 'type': 'integer' },
        'name': { 'type': 'string' },
        'description': { 'type': 'string' },
        'price': { 'type': 'float' },
        'visible': { 'type': 'boolean' },
        'ingredient': { 
            'type': 'array',
            'items': {
                '$ref': '#/definitions/ingredient' 
            }
        }
    }
})

menu_items_model = api.schema_model('items',  {
    'type': 'object',
    'required': ['items'],
    'properties': {
        'items': {
            'type': 'array',
            'items': {
                '$ref': '#/definitions/item'
            }
        }
    }
})

category_model = api.schema_model('category', {
    'type': 'object',
    'required': ['categories'],
    'properties': {
        'categories': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['id', 'name', 'position'],
                'properties': {
                    'id': { 'type': 'integer' },
                    'name': { 'type': 'string' },
                    'position': { 'type': 'integer' }
                }
            }
        }
    }
})

ingredient_model = api.schema_model('ingredient', {
    'type': 'object',
    'required': ['id', 'name'],
    'properties': {
        'id': { 'type': 'integer' },
        'name': { 'type': 'string' }
    }
})

specific_category_model = api.schema_model('specific category', {
    'type': 'object',
    'required': ['id', 'name', 'position', 'items'],
    'properties': {
        'id': { 'type': 'integer' },
        'name': { 'type': 'string' },
        'position': { 'type': 'integer' },
        'items': {
            'type': 'array',
            'items': {
                '$ref': '#/definitions/item'
            }
        }
    }
})

table_order_model = api.schema_model('table order model', {
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

sales_model = api.schema_model('sales_model', {
    'type': 'object',
    'required': ['item_sales', 'total_revenue'],
    'properties': {
        'item_sales': {
            'type': 'array',
            'items': {
                'type': 'object',
                'required': ['id', 'name', 'orders', 'price', 'revenue'],
                'properties': {
                    'id': { 'type': 'integer' },
                    'name': { 'type': 'string' },
                    'orders': { 'type': 'integer' },
                    'price': { 'type': 'number' },
                    'revenue': { 'type': 'number' }
                }
            }
        },
        'total_revenue': { 'type': 'number' }
    }
})

category_sales_model = api.schema_model('category_sales_model', {
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

recommendations_model = api.schema_model('recommendations_response_model', {
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

item_order_response_model = api.schema_model('item_order_response_model', {
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

item_order_status_response_model = api.schema_model('item_order_status_response_model', {
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

table_paid_response_model = api.schema_model('item_order_status_response_model', {
    'type': 'object',
    'required': ['tables'],
    'properties': {
        'tables': {
            'type': 'array',
            'items': { 'type': 'integer' }
        }
    }
})