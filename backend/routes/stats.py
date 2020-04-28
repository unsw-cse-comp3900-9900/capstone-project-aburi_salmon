from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from db.stats_db import stats_DB

import model.stats_model as stats_model

import model.request_model as request_model
import model.response_model as response_model

stats_db = stats_DB(db)
stats = api.namespace('stats', description='Stats Route')

@stats.route('/sales')
class Sales(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=stats_model.sales_response_model)
    @stats.response(500, 'Something went wrong')
    def get(self):
        # Make sure user is a manager
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Amount of sales for each item
        item_sales = stats_db.get_menu_item_sales()
        if (item_sales is None):
            abort(500, 'Something went wrong')

        # Sum up revenues
        total_revenue = 0
        for item in item_sales:
            total_revenue += item['revenue']

        return jsonify({'item_sales': item_sales, 'total_revenue': total_revenue})

@stats.route('/sales/<int:item_id>')
class SalesItem(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=stats_model.item_sale_response_model)
    @stats.response(500, 'Something went wrong')
    def get(self, item_id):
        # Make sure user is a manager
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')        

        # Amount of sales for each item
        item_sales = stats_db.get_menu_item_sales(item_id)[0]
        if (item_sales is None):
            abort(500, 'Something went wrong')

        return jsonify(item_sales)

@stats.route('/sales/category')
class SalesCategory(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=stats_model.category_sales_response_model)
    @stats.response(500, 'Something went wrong')
    def get(self):
        # Make sure user is a manager
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')      

        # Amount of sales for each category
        category_sales = stats_db.get_category_sales()
        if (category_sales is None):
            abort(500, 'Something went wrong')
        
        return jsonify({'category_sales': category_sales})

@stats.route('/recommend')
class Reccomend(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=stats_model.recommendations_response_model)
    @stats.response(400, 'Invalid Request')
    @stats.response(500, 'Something went wrong')
    @stats.expect(stats_model.recommendations_request_model)
    def post(self):
        # Make sure user is a customer
        order = get_jwt_claims().get('order')
        if order is None:
            abort(400, 'User is not a customer')      

        # Validate request body
        items = request.get_json().get('items')
        if (not items):
            abort(400, 'Invalid request. Missing field \'items\'')
        
        # Get recommendations
        recommendations = stats_db.get_recommendation(items)

        if (recommendations is None):
            abort(500, 'Something went wrong')

        return jsonify({'recommendations': recommendations})
