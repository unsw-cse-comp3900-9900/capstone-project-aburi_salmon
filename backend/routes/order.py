from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import new_order_model

order = api.namespace('order', description='Order Route')

@order.route('/')
class Order(Resource):
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):
        item_order = db.get_ordered_items_customer()
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

        print(item_id)
        print(quantity)
        table_id = 3 #assuming table id is 3 for now
        new = db.new_order(table_id, item_id, quantity)

        if new is None:
            abort(400, 'Backend is not working as intended or the supplied information was malformed. Make sure that your username is unique.')

        response = jsonify({
            'status': 'success'
        })
