from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
import model.request_model as request_model
import model.response_model as response_model

stats = api.namespace('stats', description='Stats Route')

@stats.route('/sales')
class Sales(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=response_model.sales_model)
    @stats.response(500, 'Something went wrong')
    def get(self):
        # Amount of sales for each item
        item_sales = db.get_menu_item_sales()
        if (item_sales is None):
            abort(500, 'Something went wrong')

        total_revenue = 0
        for item in item_sales:
            total_revenue += item['revenue']
        return jsonify({'item_sales': item_sales, 'total_revenue': total_revenue})

@stats.route('/sales/<int:item_id>')
class SalesItem(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=response_model.sales_model)
    @stats.response(500, 'Something went wrong')
    def get(self, item_id):
        # Amount of sales for each item
        item_sales = db.get_menu_item_sales(item_id)[0]
        if (item_sales is None):
            abort(500, 'Something went wrong')

        return jsonify(item_sales)

@stats.route('/sales/category')
class SalesCategory(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=response_model.category_sales_model)
    @stats.response(500, 'Something went wrong')
    def get(self):
        # Amount of sales for each category
        category_sales = db.get_category_sales()
        if (category_sales is None):
            abort(500, 'Something went wrong')
        
        return jsonify({'category_sales': category_sales})

@stats.route('/recommend')
class Reccomend(Resource):
    @jwt_required
    @stats.response(200, 'Success', model=response_model.recommendations_model)
    @stats.response(400, 'Invalid Request')
    @stats.response(500, 'Something went wrong')
    @stats.expect(request_model.recommendations_model)
    def post(self):
        items = request.get_json().get('items')
        if (not items):
            abort(400, 'Invalid request. Missing field \'items\'')
        
        recommendations = db.get_recommendation(items)

        if (recommendations is None):
            abort(500, 'Something went wrong')

        return jsonify({'recommendations': recommendations})
