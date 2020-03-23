from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import new_menu_item_model
from model.response_model import menu_items_model

menu = api.namespace('menu', description='Menu Route')

@menu.route('/')
class Menu(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid request')
    def get(self):
        # Return the entire menu

        categories = db.get_category(0)
        lists = []

        for index in range(len(categories)):
           for key in categories[index]:
                if(key == 'name'): 
                    cat = categories[index][key]
                    item = db.get_item_from_category(cat)
                    myDict = {}
                    myDict['cat'] = cat
                    myDict['item'] = item
                    #print(myDict)
                    lists.append(myDict)
        
        #print(lists)

        return { 'menu': lists }


@menu.route('/item')
class CreateMenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(new_menu_item_model)
    def post(self):
        # Create a new menu item
        item = request.get_json()
        if (not db.create_item(item)):
            abort(400, 'Invalid request')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=menu_items_model)
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Get all menu items
        items = db.get_all_menu_items()
        return jsonify({ 'items': items })

@menu.route('/item/<int:id>')
class MenuItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def put(self, id):
        # Modify a menu item
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        # Get a specific menu item
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a specific menu item
        pass


@menu.route('/category')
class CreateMenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self):
        # Create a new category
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Get all the categories
        pass


@menu.route('/category/<int:id>')
class MenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def put(self, id):
        # Modify a category
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        # Get all the items in a category
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a category only if empty
        pass


@menu.route('/category/<int:category_id>/item/<int:item_id>')
class MenuCategoryItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self, category_id, item_id):
        # Add an item to a category
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, category_id, item_id):
        # Remove an item from a category
        pass


@menu.route('/ingredient')
class CreateMenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Return all ingredients
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self):
        # Create a new ingredient
        pass


@menu.route('/ingredient/<int:id>')
class MenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        # Return a specific ingredient
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def put(self, id):
        # Modify a specific ingredient
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a specific ingredient
        # Only if not used
        pass

@menu.route('/item/<int:item_id>/ingredient/<int:ingredient_id>')
class MenuItemIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def post(self, item_id, ingredient_id):
        # Add an ingredient to an item
        pass

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, item_id, ingredient_id):
        # Remove ingredient from an item
        pass