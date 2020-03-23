from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import new_order_model, modify_order_model, delete_order_model

order = api.namespace('order', description='Order Route')

@order.route('/order')
class Order(Resource):
    #@jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):
        table_id = 3 #assuming table id is 3 for now
        item_order = db.get_ordered_items_customer(table_id)
        return { 'item_order': item_order }

    #@jwt_required
    @order.expect(new_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    @order.response(500, 'Something went wrong')
    def put(self):

        new_order = request.get_json()
        num_of_orders = len(new_order.get('new_orders'))

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

        response = jsonify({
            'status': 'success'
        })

@order.route('/edit')
class Item(Resource):
    #@jwt_required
    @order.expect(modify_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def patch(self):

        modify_order = request.get_json()
        item_id = modify_order.get('item_id')
        quantity = modify_order.get('quantity')

        table_id = 3 #assuming table id is 3 for now
        item_order_id = db.get_item_order_id(table_id, item_id)

        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        check = 0
        for row in item_order_id:
            order_status = db.get_order_status(row)
            if order_status != 1:
                #abort(400, 'Cannot modify order since order has left the QUEUE status.')
                continue
            else:
                new = db.modify_order(row, quantity)
                if new != 5:
                    check = 1
                    break
                else:
                    continue

        if check == 0:
            abort(400, 'New quantity has to be >= 1 OR order has left the QUEUE status, please make a NEW order instead.')
        
        response = jsonify({
            'status': 'success'
        })

    #@jwt_required
    @order.expect(delete_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def delete(self):

        delete_order = request.get_json()
        item_id = delete_order.get('item_id')

        table_id = 3 #assuming table id is 3 for now

        item_order_id = db.get_item_order_id(table_id, item_id)
        print("item_order_id")
        print(item_order_id)

        if item_order_id is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        
        check = 0
        for row in item_order_id:
            order_status = db.get_order_status(row[0])
            if order_status != 1:
                #abort(400, 'Cannot modify order since order has left the QUEUE status.')
                continue
            else:
                new = db.delete_order(row)
                check = 1
                break

        if check == 0:
            abort(400, 'Cannot delete order since order has left the QUEUE status.')
        
        response = jsonify({
            'status': 'success'
        })


