from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from db.order_db import order_DB
#from db import order_db
import model.response_model as response_model
import model.request_model as request_model
from util.socket import socket

order_db = order_DB(db)
order = api.namespace('order', description='Order Route')

# The route for the landing order page
@order.route('/', strict_slashes=False)
class Order(Resource):
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):

        # Claim information of orders
        order_id = get_jwt_claims().get('order')
        item_order = order_db.get_ordered_items_customer(order_id)
        bill_request = order_db.get_order_status(order_id)
        total = 0

        # Basic error checking
        if item_order is None:
            abort(404, 'No order found on database.')

        # List the price of an order
        for k in item_order:
            total = total + k.get('price')

        return { 
            'item_order': item_order,
            'total_bill': total,
            'bill_request': bill_request
        }

    @jwt_required
    @order.expect(request_model.new_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    @order.response(500, 'Something went wrong')

    def post(self):

        new_order = request.get_json()
        num_of_orders = len(new_order.get('order'))
        order_id = get_jwt_claims().get('order')
        table_id = order_db.get_table_id(order_id)

        if(order_id is None):
            order_id = order_db.insert_order(table_id)

        # Emit to Kitchen Staff that a new order has been placed
        socket.emit('order', { 'table': table_id }, room='staff2')
        
        for i in range(0, num_of_orders):
            item_id = new_order.get('order')[i].get('item_id')
            quantity = new_order.get('order')[i].get('quantity')
            comment = new_order.get('order')[i].get('comment')

            if not comment:
                comment = ""

            new = order_db.insert_item_order(order_id, item_id, quantity, comment)
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
        # Add an order
        add_order = request.get_json()
        item_id = add_order.get('item_id')
        quantity = add_order.get('quantity')
        comment = add_order.get('comment')

        if not comment:
            comment = ""

        # Get the order_id
        order_id = get_jwt_claims().get('order')

        # Check that an order ID Exists
        if order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        if quantity is None or quantity == 0 or item_id is None:
            abort(400, 'Quantity or item_id missing')

        new = order_db.add_order(order_id, item_id, quantity, comment)

        if new is None:
            abort(400, 'Could not create entry')
        
        return {
            'status': 'success',
            'id': new
        }
        

    #@jwt_required
    @jwt_required
    @order.expect(request_model.modify_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def patch(self):
        
        modify_order = request.get_json()
        item_order_id = modify_order.get('id')
        quantity = modify_order.get('quantity')
        comment = modify_order.get('comment')
        order_id = get_jwt_claims().get('order')
        table_id = order_db.get_table_id(order_id)

        # String to send modifications notification to backend
        modifications = 'Table ' + str(table_id) + ' has modified order ' + str(item_order_id)
        print(modifications)
        socket.emit('modify', { 'modifications': modifications}, room='staff2')

        # If order ID is empty, send error message to create new order
        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        new = order_db.modify_item_order(item_order_id, comment, quantity)
        if new == 5:
            abort(400, 'New quantity has to be >= 1 OR order has left the QUEUE status, please make a NEW order instead.')
        
        response = jsonify({
            'status': 'success'
        })

    # Deleting an order using a given order_id
    @order.expect(request_model.delete_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    @jwt_required

    def delete(self):
        delete_order = request.get_json()
        item_order_id = delete_order.get('id')

        order_id = get_jwt_claims().get('order')
        table_id = order_db.get_table_id(order_id)

        # Socket to send to kitchen staff if order has been deleted
        deletions = 'Table ' + str(table_id) + ' has deleted order ' + str(item_order_id)
        socket.emit('delete', { 'deletions': deletions }, room='staff2')

        # Error checking if item order ID is incorrect
        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        order_status = order_db.get_item_order_status(item_order_id)
        if order_status != 1:
            abort(400, 'Cannot modify order since order has left the QUEUE status.')
        else:
            new = order_db.delete_item_order(item_order_id)

        response = jsonify({
            'status': 'success'
        })

@order.route('/item/status/<int:item_order_id>')
class ModifyItemOrderStatus(Resource):
    # Use this route to modify the status of an item order
    # Pass the new status_id in the body
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid Request')
    @order.response(500, 'Something went wrong')
    @order.expect(request_model.edit_item_order_status_model)
    # For the order menu page
    def put(self, item_order_id):
        status = request.get_json().get('status')
        print('the status is ' + str(status))
        if (not status):
            abort(400, 'Invalid request. Missing required field \'status\'')
        
        if (not order_db.update_item_ordered_status(item_order_id, status)):
            abort(500, 'Something went wrong')
        print('item_id is ' + str(item_order_id))


        # Sends notification that an order is cooking, ready or server to the customer
        order_id = order_db.get_orderId(item_order_id)
        print('item_id is ' + str(order_id))
        customerRoom = 'customer' + str(order_id)
          if status == 2 :
            print('customer room is ' + customerRoom)
            socket.emit('cooking', room=customerRoom)
            socket.emit('cooking', room='staff1')
            socket.emit('cooking', room='staff2')
            print('we have emitted to ' + customerRoom)
        elif status == 3:
            socket.emit('ready', room=customerRoom)
            socket.emit('ready', room='staff1')
            socket.emit('ready', room='staff2')
            print('we have emitted to ' + customerRoom)
        elif status == 4:
            socket.emit('served', room=customerRoom)
            socket.emit('served', room='staff1')
            socket.emit('served', room='staff2')
            print('we have emitted to ' + customerRoom)
        
    
        return jsonify({ 'status': 'success'})

@order.route('/<int:order_id>')
class ItemOrderById(Resource):
    @jwt_required
    @order.response(200, 'Success', model=response_model.item_order_response_model)
    @order.response(500, 'Internal Error')
    def get(self, order_id):
        itemList = order_db.get_ordered_items(order_id)
        table = order_db.get_table_id(order_id)
        if (itemList is None or table is None):
            abort(500, 'Something went wrong')
        return jsonify({ 'itemList': itemList, 'table': table })

@order.route('/status/<int:status_id>')
class OrdersByStatus(Resource):
    @jwt_required
    @order.response(200, 'Success', model=response_model.item_order_status_response_model)
    @order.response(400, 'Invalid Request')
    def get(self, status_id):
        itemlist = order_db.get_order_list(status_id)
        if (not itemlist):
            abort(400, 'Invalid request')

        return jsonify({'itemList' : itemlist})


# Route to estimate the time for an order
@order.route('/time', strict_slashes=False)
class OrderTime(Resource):
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    @order.expect(request_model.order_time_model)
    def post(self):
        order_id = request.get_json().get('order_id')

        time = order_db.get_order_time(order_id)

        return { 
            'estimated_time': time
        }

    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):
        order_id = get_jwt_claims().get('order')

        time = db.get_order_time(order_id)

        return { 
            'estimated_time': time
        }