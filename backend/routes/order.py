from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import new_order_model, add_order_model, reduce_order_model, delete_order_model

order = api.namespace('order', description='Order Route')

@order.route('/order')
class Order(Resource):
    @jwt_required
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
        item_id = new_order.get('item_id')
        quantity = new_order.get('quantity')

        table_id = 3 #assuming table id is 3 for now
        new = db.new_order(table_id, item_id, quantity)

        if new is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your username is unique.')

        response = jsonify({
            'status': 'success'
        })


@order.route('/edit')
class Item(Resource):
    #@jwt_required
    @order.expect(add_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def put(self):

        add_order = request.get_json()
        item_id = add_order.get('item_id')
        quantity = add_order.get('quantity')

        table_id = 3 #assuming table id is 3 for now
        order_id = db.get_order_id(table_id)
        if order_id is None:
            abort(400, 'Table has not order anything yet.')

        new = db.add_order(order_id, item_id, quantity)

        if new is None:
            abort(400, 'No existing order with that item, please make a new order instead.')

        response = jsonify({
            'status': 'success'
        })

    #@jwt_required
    @order.expect(reduce_order_model)
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def patch(self):

        reduce_order = request.get_json()
        item_id = reduce_order.get('item_id')
        quantity = reduce_order.get('quantity')

        table_id = 3 #assuming table id is 3 for now
        order_id = db.get_order_id(table_id)
        if order_id is None:
            abort(400, 'Table has not order anything yet.')

        order_status = db.get_order_status(order_id, item_id)
        if order_status is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        elif order_status != 1:
            abort(400, 'Cannot reduce order since order has left the QUEUE status.')

        new = db.reduce_order(order_id, item_id, quantity)

        if new == 5:
            abort(400, 'New quantity has to be 1 or more.')

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
        order_id = db.get_order_id(table_id)
        if order_id is None:
            abort(400, 'Table has not order anything yet.')

        order_status = db.get_order_status(order_id, item_id)

        if order_status is None:
            abort(400, 'No existing order with that item, please make a new order instead.')
        elif order_status != 1:
            abort(400, 'Cannot delete order since order has left the QUEUE status.')

        new = db.delete_order(order_id, item_id)

        response = jsonify({
            'status': 'success'
        })

