from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import edit_order_item_status_model

kitchen = api.namespace('kitchen', description='Kitchen Staff Route')

@kitchen.route('/')
class Kitchen(Resource):
    @jwt_required
    @kitchen.response(200, 'Success')
    @kitchen.response(400, 'Invalid request')
    def get(self):
        orders = db.get_ordered_items()
        return { 'orders': orders }

    @jwt_required
    @kitchen.expect(edit_order_item_status_model)
    @kitchen.response(200, 'Success')
    @kitchen.response(400, 'Invalid request')
    @kitchen.response(500, 'Something went wrong')
    def put(self):
        order_update = request.get_json()
        id = order_update.get('id')
        status = order_update.get('status')

        if (db.update_ordered_item_status(id, status)):
            return 'Success'
        
        return 500, 'Something went wrong'

    beginCooking(self, item_id):
        db.beginCooking(item_id)
    
    finishCooking(self, item_id):
        db.beginCooking(item_id)
    
        
