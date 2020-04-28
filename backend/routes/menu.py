from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from db.menu_db import menu_DB

import model.menu_model as menu_model

menu_db = menu_DB(db)
menu = api.namespace('menu', description='Menu Route')

@menu.route('/')
class Menu(Resource):
    @jwt_required
    @menu.response(200, 'Success', model = menu_model.menu_response_model)
    @menu.response(400, 'Invalid request')
    def get(self):
        # Get all the items in the menu

        # Get all the categories in the menu
        categories = menu_db.get_categories()
        menu = []

        # Query all the menu items in each category and append to the menu
        for category in categories:
            menu.append(menu_db.get_category(category['id']))
    
        return { 'menu': menu }


@menu.route('/item')
class CreateMenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success', model=menu_model.menu_item_id_response_model)
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    @menu.expect(menu_model.menu_item_request_model)
    def post(self):
        # Create a new menu item

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Get and validate request body
        item = request.get_json()

        if not(item.get('name') and item.get('price')):
            abort(400, 'Request missing required fields')

        if item.get('visible') is None:
            item['visible'] = True
        
        if item.get('description') is None:
            item['description'] = ''

        if  item.get('image_url') is None:
            item['image_url'] = ''


        # Create new item in db
        item_id = menu_db.create_item(item)
        if (not item_id):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'item_id': item_id })

    @jwt_required
    @menu.response(200, 'Success', model=menu_model.menu_items_response_model)
    def get(self):
        # Get all menu items
        items = menu_db.get_all_menu_items()
        return jsonify({ 'items': items })

@menu.route('/item/<int:item_id>')
class MenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(menu_model.menu_item_request_model)
    def put(self, item_id):
        # Modify a menu item

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Get and validate request body
        edit = request.get_json()
        if (not menu_db.edit_item(edit, item_id)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })


    @jwt_required
    @menu.response(200, 'Success', model=menu_model.menu_item_response_model)
    @menu.response(500, 'Something went wrong')
    def get(self, item_id):
        # Get a specific menu item
        item = menu_db.get_item_by_id(item_id)
        if (not item):
            abort(500, 'Something went wrong')
        
        return jsonify(item)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def delete(self, item_id):
        # Delete a specific menu item

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        if (not menu_db.delete_item(item_id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })


@menu.route('/category')
class CreateMenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    @menu.expect(menu_model.category_request_model)
    def post(self):
        # Create a new category in the menu

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Get and validate request body
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Missing required field \'name\'')

        # Create new category in the database
        if (not menu_db.create_category(name)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=menu_model.category_response_model)
    @menu.response(500, 'Something went wrong')
    def get(self):
        # Get all the cateogies in the menu
        categories = menu_db.get_categories()
        if (not categories):
            abort(500, 'Something went wrong')

        return jsonify({ 'categories': categories })


@menu.route('/category/<int:category_id>')
class MenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    @menu.expect(menu_model.category_request_model)
    def put(self, category_id):
        # Edit a category

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        edit = request.get_json()
        # Edit the category in the database
        if (not menu_db.edit_category(edit)):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=menu_model.category_items_response_model)
    @menu.response(500, 'Something went wrong')
    def get(self, category_id):
        # Get a category and its menu items
        category = menu_db.get_category(category_id)
        if (not category):
            abort(500, 'Invalid request')

        return jsonify(category)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def delete(self, category_id):
        # Delete a category from the menu

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')
    
        items = menu_db.get_items_by_category(category_id)
        if items is None:
            abort(500, 'Something went wrong')
        elif (len(items) > 0):
            abort(400, 'Can only delete empty category')

        # Delete a category
        if (not menu_db.delete_category(category_id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })

@menu.route('/category/swap/<int:category_id1>/<int:category_id2>')
class ManuCategorySwap(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def post(self, category_id1, category_id2):
        # Swap position of two categories

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Maintain the correct order when passing in arguments
        id1 = min(category_id1, category_id2)
        id2 = max(category_id1, category_id2)

        if (not menu_db.swapCategoryPositions(id1, id2)):
            abort(500, 'Failed to swap category positions')
        
        return jsonify({ 'status': 'success' })

@menu.route('/category/<int:category_id>/item/<int:item_id>')
class MenuCategoryItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def post(self, category_id, item_id):
        # Add an item to a category

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        if (not menu_db.add_item_to_category(category_id, item_id)):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def delete(self, category_id, item_id):
        # Remove an item from a category

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        if (not menu_db.remove_item_from_category(category_id, item_id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })



@menu.route('/ingredient')
class CreateMenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(500, 'Something went wrong')
    def get(self):
        # Get a list of all ingredients
        ingredients = menu_db.get_all_ingredients()
        if (not ingredients):
            abort(500, 'Something went wrong')
        
        return ingredients

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(menu_model.ingredient_request_model)
    def post(self):
        # Create a new ingredient

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Validate request body
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Missing ingredient name')

        # Create new ingredient item
        if (not menu_db.create_ingredient(name)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

@menu.route('/ingredient/<int:id>')
class MenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success', model=menu_model.ingredient_response_model)
    @menu.response(500, 'Something went wrong')
    def get(self, id):
        # Return a specific ingredient
        ingredient = menu_db.get_ingredient_by_id(id)
        if (not ingredient):
            abort(500, 'Something went wrong')
        
        return jsonify(ingredient)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    @menu.expect(menu_model.ingredient_request_model)
    def put(self, id):
        # Modify a specific ingredient

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Validate request body
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Invalid request')

        # Edit ingredient in the menu
        if (not menu_db.edit_ingredient(name, id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def delete(self, id):
        # Delete a specific ingredient
        # Only if not used

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        if (not menu_db.delete_ingredient(id)):
            abort(500, 'Ingredient still in use')

        return jsonify({ 'status': 'success' })

@menu.route('/item/<int:item_id>/ingredient/<int:ingredient_id>')
class MenuItemIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def post(self, item_id, ingredient_id):
        # Add an ingredient to an item

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Add ingredient to item in the database
        if (not menu_db.add_ingredient_to_item(item_id, ingredient_id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.response(500, 'Something went wrong')
    def delete(self, item_id, ingredient_id):
        # Remove ingredient from an item

        role = get_jwt_claims().get('role')
        # Make sure user is a manager
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Remove ingredeint from item in the database
        if (not menu_db.remove_ingredient_from_item(item_id, ingredient_id)):
            abort(500, 'Something went wrong')

        return jsonify({ 'status': 'success' })
