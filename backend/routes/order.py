from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import add_order_item_model, edit_order_item_status_model

order = api.namespace('order', description='Order Route')

@order.route('/')
class Order(Resource):
    @jwt_required
    @order.response(200, 'Success')
    @order.response(400, 'Invalid request')
    def get(self):
        orders = db.get_ordered_items_customer()
        return { 'orders': orders }

    @jwt_required
    def put(self):
        pass



    
        
