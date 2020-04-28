from flask_restx import fields

from app import api


menu_response_model = api.schema_model('Menu-Response-Model', {

})


menu_item_request_model = api.model('Menu-Item-Request-Model', {
    'name': fields.String(description='name of new menu item'),
    'description': fields.String(description='description of new menu item'),
    'price': fields.Float(description='price of the new item'),
    'visible': fields.Boolean(description='is the item visible on the menu'),
    'image_url': fields.String(description='Url of the menu item image')
})

menu_item_id_response_model = api.model('Menu-Item-ID-Response-Model', {
    'item_id': fields.Integer(description='id of newly created item')
})

menu_items_response_model = api.schema_model('Menu-Items-Response-Model',  {
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

menu_item_response_model = api.schema_model('Menu-Item-Response-Model', {
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

category_request_model = api.model('Category-Request-Model', {
    'name': fields.String(description='category name')
})

category_response_model = api.schema_model('Category-Response-Model', {
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

category_items_response_model = api.schema_model('Category-Items-Response-Model', {
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

ingredient_request_model = api.model('Ingredient-Request-Model', {
    'name': fields.String(description='ingredient name')
})

ingredient_response_model = api.schema_model('Ingredient-Response-Model', {
    'type': 'object',
    'required': ['id', 'name'],
    'properties': {
        'id': { 'type': 'integer' },
        'name': { 'type': 'string' }
    }
})