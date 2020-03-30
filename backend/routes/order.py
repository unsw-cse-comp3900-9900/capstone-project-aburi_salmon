from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
import model.response_model as response_model
import model.request_model as request_model

order = api.namespace('order', description='Order Route')

@order.route('/')
class Order(Resource):
    #@jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):
        table_id = 1 #assuming table id is 1 for now
        item_order = db.get_ordered_items_customer(table_id)

        total = 0

        if item_order is None:
            abort(404, 'No order found on database.')

        for k in item_order:
            total = total + k.get('price')

        return { 
            'item_order': item_order,
            'total_bill': total
        }

    #@jwt_required
    @order.expect(request_model.new_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    @order.response(500, 'Something went wrong')
    def put(self):

        new_order = request.get_json()
        num_of_orders = len(new_order.get('order'))

        table_id = 3 #assuming table id is 3 for now

        #check if there's anexisting order_id
        order_id = db.get_order_id(table_id)
        if(order_id is None):
            order_id = db.insert_order(table_id)

        for i in range(0, num_of_orders):
            item_id = new_order.get('new_orders')[i].get('item_id')
            quantity = new_order.get('new_orders')[i].get('quantity')
            new = db.insert_item_order(order_id, item_id, quantity)
            if new is None:
                abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your username is unique.')

        return {
            'status': 'success'
        } 

@order.route('/item')
class Item(Resource):
    @order.expect(request_model.add_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def put(self):
        add_order = request.get_json()
        item_id = add_order.get('item_id')
        quantity = add_order.get('quantity')

        order_id = 41   # Dummy order id. Use the cookie to create order

        if order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        if quantity is None or quantity == 0 or item_id is None:
            abort(400, 'Quantity or item_id missing')
        
        new = db.add_order(order_id, item_id, quantity)

        if new is None:
            abort(400, 'Could not create entry')
        
        return {
            'status': 'success',
            'id': new
        }
        

    #@jwt_required
    @order.expect(request_model.modify_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def patch(self):

        modify_order = request.get_json()
        item_order_id = modify_order.get('id')
        quantity = modify_order.get('quantity')

        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        new = db.modify_order(item_order_id, quantity)
        if new == 5:
            abort(400, 'New quantity has to be >= 1 OR order has left the QUEUE status, please make a NEW order instead.')
        
        response = jsonify({
            'status': 'success'
        })

    #@jwt_required
    @order.expect(request_model.delete_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def delete(self):

        delete_order = request.get_json()
        item_order_id = delete_order.get('id')

        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        order_status = db.get_order_status(item_order_id)
        if order_status != 1:
            abort(400, 'Cannot modify order since order has left the QUEUE status.')
        else:
            new = db.delete_order(item_order_id)

        response = jsonify({
            'status': 'success'
        })

@order.route('/item/status/<int:item_order_id>')
class ModifyItemOrder(Resource):
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid Request')
    @order.response(500, 'Something went wrong')
    @order.expect(request_model.edit_item_order_status_model)
    def put(self, item_order_id):
        status = request.get_json().get('status')
        if (not status):
            abort(400, 'Invalid request. Missing required field \'status\'')
        
        if (not db.update_item_ordered_status(item_order_id, status)):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'status': 'success'})


@order.route('/<int:order_id>')
class ItemOrderById(Resource):
    # Most the methods for getting information about an order should be done via the table route

    @jwt_required
    @order.response(200, 'Success', model=response_model.item_order_response_model)
    @order.response(500, 'Internal Error')
    def get(self, order_id):
        itemList = db.get_ordered_items(order_id)
        if (itemList is None):
            abort(500, 'Something went wrong')
        return { 'itemList': itemList }

@order.route('/status/<int:status_id>')
class OrdersByStatus(Resource):
    @jwt_required
    @order.response(200, 'Success', model=response_model.item_order_response_model)
    @order.response(400, 'Invalid Request')
    def get(self, status_id):
        itemlist = db.get_order_list(status_id)
        if (not itemlist):
            abort(400, 'Invalid request')

        return {'itemList' : itemlist}
