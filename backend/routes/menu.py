from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from db.menu_db import menu_DB

import model.request_model as request_model
import model.response_model as response_model
from model.response_model import menu_items_model, menu_item_model

menu_db = menu_DB(db)
menu = api.namespace('menu', description='Menu Route')

@menu.route('/')
class Menu(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid request')
    def get(self):
        # Return the entire menu

        categories = menu_db.get_categories()

        menu = []

        for category in categories:
            menu.append(menu_db.get_category(category['id']))
    
        return { 'menu': menu }


@menu.route('/item')
class CreateMenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.menu_item_model)
    def post(self):
        # Create a new menu item
        item = request.get_json()
        item_id = menu_db.create_item(item)
        if (not item_id):
            abort(400, 'Invalid request')
        
        return jsonify({ 'item_id': item_id })

    @jwt_required
    @menu.response(200, 'Success', model=response_model.menu_items_model)
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Get all menu items
        items = menu_db.get_all_menu_items()
        return jsonify({ 'items': items })

@menu.route('/item/<int:item_id>')
class MenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.menu_item_model)
    def put(self, item_id):
        # Modify a menu item
        edit = request.get_json()
        if (not menu_db.edit_item(edit, item_id)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })


    @jwt_required
    @menu.response(200, 'Success', model=response_model.menu_item_model)
    @menu.response(400, 'Invalid Request')
    def get(self, item_id):
        # Get a specific menu item
        item = menu_db.get_item_by_id(item_id)
        if (not item):
            abort(400, 'Invalid request')
        
        return jsonify(item)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, item_id):
        # Delete a specific menu item
        if (not menu_db.delete_item(item_id)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })


@menu.route('/category')
class CreateMenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.category_model)
    def post(self):
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Missing required field \'name\'')

        if (not menu_db.create_category(name)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=response_model.category_model)
    @menu.response(400, 'Invalid Request')
    def get(self):
        categories = menu_db.get_categories()
        if (not categories):
            abort(400, 'Invalid request')

        return jsonify({ 'categories': categories })


@menu.route('/category/<int:category_id>')
class MenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.category_model)
    def put(self, category_id):
        if (not menu_db.edit_category(editStatement, editArr)):
            abort(400, 'Something went wrong')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=response_model.specific_category_model)
    @menu.response(400, 'Invalid Request')
    def get(self, category_id):
        category = menu_db.get_category(category_id)
        if (not category):
            abort(400, 'Invalid request')

        return jsonify(category)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, category_id):
        items = menu_db.get_items_by_category(category_id)
        if (len(items) > 0):
            abort(400, 'Can only delete empty category')

        # Delete a category
        if (not menu_db.delete_category(category_id)):
            abort(400, 'Invalid request')


        return jsonify({ 'status': 'success' })

@menu.route('/category/swap/<int:category_id1>/<int:category_id2>')
class ManuCategorySwap(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self, category_id1, category_id2):
        # Maintain the correct order when passing in arguments
        id1 = min(category_id1, category_id2)
        id2 = max(category_id1, category_id2)

        if (not menu_db.swapCategoryPositions(id1, id2)):
            abort(400, 'Failed to swap category positions')
        
        return jsonify({ 'status': 'success' })

@menu.route('/category/<int:category_id>/item/<int:item_id>')
class MenuCategoryItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self, category_id, item_id):
        # Add an item to a category
        if (not menu_db.add_item_to_category(category_id, item_id)):
            abort(400, 'Invalid request')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, category_id, item_id):
        # Remove an item from a category
        if (not menu_db.remove_item_from_category(category_id, item_id)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })



@menu.route('/ingredient')
class CreateMenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Get a list of all ingredients
        ingredients = menu_db.get_all_ingredients()
        if (not ingredients):
            abort(400, 'Invalid request')
        
        return ingredients

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.ingredient_model)
    def post(self):
        # Create a new ingredient
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Missing ingredient name')

        if (not menu_db.create_ingredient(name)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

@menu.route('/ingredient/<int:id>')
class MenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success', model=response_model.ingredient_model)
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        # Return a specific ingredient
        ingredient = menu_db.get_ingredient_by_id(id)
        if (not ingredient):
            abort(400, 'Invalid request, ingredient not found')
        
        return jsonify(ingredient)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.ingredient_model)
    def put(self, id):
        # Modify a specific ingredient
        name = request.get_json().get('name')
        if (not name):
            abort(400, 'Invalid request')

        if (not menu_db.edit_ingredient(name, id)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a specific ingredient
        # Only if not used

        if (not menu_db.delete_ingredient(id)):
            abort(400, 'Ingredient still in use')

        return jsonify({ 'status': 'success' })

@menu.route('/item/<int:item_id>/ingredient/<int:ingredient_id>')
class MenuItemIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self, item_id, ingredient_id):
        # Add an ingredient to an item
        if (not menu_db.add_ingredient_to_item(item_id, ingredient_id)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, item_id, ingredient_id):
        # Remove ingredient from an item
        if (not menu_db.remove_ingredient_from_item(item_id, ingredient_id)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })