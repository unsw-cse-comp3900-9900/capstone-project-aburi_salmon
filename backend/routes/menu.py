from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
import model.request_model as request_model
import model.response_model as response_model
from model.response_model import menu_items_model, menu_item_model

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
    @menu.expect(request_model.menu_item_model)
    def post(self):
        # Create a new menu item
        item = request.get_json()
        if (not db.create_item(item)):
            abort(400, 'Invalid request')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=response_model.menu_items_model)
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
    @menu.expect(request_model.menu_item_model)
    def put(self, id):
        # Modify a menu item
        edit = request.get_json()
        editArr = []
        editStatement = 'UPDATE item SET '
        if (edit.get('name')):
            editStatement += "name = %s, "
            editArr.append(edit.get('name'))
        if (edit.get('description')):
            editStatement += "description = %s, "
            editArr.append(edit.get('description'))
        if (edit.get('price')):
            editStatement += "price = %s, "
            editArr.append(edit.get('price'))
        if (edit.get('visible')):
            editStatement += "visible = %s, "
            editArr.append(edit.get('visible'))

        editStatement = editStatement.strip(', ') + ' WHERE id = %s'
        editArr.append(id)
        if (not db.edit_item(editStatement, editArr)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })


    @jwt_required
    @menu.response(200, 'Success', model=response_model.menu_item_model)
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        # Get a specific menu item
        item = db.get_item_by_id(id)
        if (not item):
            abort(400, 'Invalid request')
        
        return jsonify(item)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a specific menu item
        if (not db.delete_item(id)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })


@menu.route('/category')
class CreateMenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.category_model)
    def post(self):
        category = request.get_json()
        if (not db.create_category(category)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success', model=response_model.category_model)
    @menu.response(400, 'Invalid Request')
    def get(self):
        categories = db.get_categories()
        if (not categories):
            abort(400, 'Invalid request')

        return jsonify({ 'categories': categories })


@menu.route('/category/<int:id>')
class MenuCategory(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.category_model)
    def put(self, id):
        edit = request.get_json()
        editArr = []
        editStatement = 'UPDATE category SET '

        if (edit.get('name')):
            editStatement += "name = %s, "
            editArr.append(edit.get('name'))
        if (edit.get('position')):
            editStatement += "position = %s, "
            editArr.append(edit.get('position'))

        editStatement = editStatement.strip(', ') + ' WHERE id = %s'
        editArr.append(id)
        if (not db.edit_category(editStatement, editArr)):
            abort(400, 'Something went wrong')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self, id):
        category = db.get_category(id)
        if (not category):
            abort(400, 'Invalid request')

        items = db.get_items_by_category(id)
        category['items'] = items

        return jsonify(category)

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, id):
        # Delete a category
        if (not db.delete_category(id)):
            abort(400, 'Invalid request')
        
        return jsonify({ 'status': 'success' })


@menu.route('/category/<int:category_id>/item/<int:item_id>')
class MenuCategoryItem(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    @menu.expect(request_model.add_item_to_category_model)
    def post(self, category_id, item_id):
        # Add an item to a category

        position = request.get_json().get('position')
        if (not position):
            abort(400, 'No position given')

        if (not db.add_item_to_category(category_id, item_id, position)):
            abort(400, 'Invalid request')
        
        return jsonify({ 'status': 'success' })

    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def delete(self, category_id, item_id):
        # Remove an item from a category
        if (not db.remove_item_from_category(category_id, item_id)):
            abort(400, 'Invalid request')

        return jsonify({ 'status': 'success' })



@menu.route('/ingredient')
class CreateMenuIngredient(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid Request')
    def get(self):
        # Get a list of all ingredients
        ingredients = db.get_all_ingredients()
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
        
        if (not db.create_ingredient(name)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

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