from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
import model.response_model as response_model
import model.request_model as request_model
from util.socket import socket

table = api.namespace('table', description='Order Route')

@table.route('/')
class Table(Resource):
    @table.response(200, 'Success', model=response_model.tables_model)
    @table.response(400, 'Invalid request')
    @table.doc(description="Get a list of tables and their status (occupied or not?)")
    def get(self):
        tables = db.get_tables()
        return jsonify({ 'tables': tables })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.expect(request_model.table_model)
    @table.doc(description="Create a new table")
    def post(self):
        table = request.get_json().get('table')
        if (not table):
            abort(400, 'Table number not provided')
        if (not db.create_table(table)):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.doc(description="Delete the highest numbered table")
    def delete(self):
        if (not db.delete_table()):
            abort(400, 'Something went wrong')

        return jsonify({ 'status': 'success' })

@table.route('/orders/<int:table>')
class TableOrders(Resource):
    @jwt_required
    @table.response(200, 'Success', model=response_model.table_order_model)
    @table.response(400, 'Invalid request')
    @table.doc(description="Get the order of the table")
    def get(self, table):
        order_id = db.get_order_id(table)

        if (not order_id):
            abort(400, 'No orders for this table')

        order_items = db.get_ordered_items(order_id)
        if (order_items is None):
            abort(400, 'Something went wrong')

        total_cost = 0
        for item in order_items:
            total_cost += item['quantity']*item['price']

        return jsonify({
            'table': table,
            'order_id': order_id,
            'items': order_items,
            'total_cost': total_cost
        })        


@table.route('/free/<int:table>')
class FreeTable(Resource):
    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    def post(self, table):
        if (not db.set_table_free(table)):
            abort(400, 'Something went wrong')

        print('Table #' + str(table) + ' set occupied as false')
        return jsonify({ 'status': 'success' })

@table.route('/assistance')
class Assistance(Resource):
    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    def get(self):
        tables = db.get_assistance_tables()
        if (tables is None):
            abort(400, 'Something went wrong')

        return jsonify({'tables': tables})

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.expect(request_model.table_assistance_model)
    def put(self):
        body = request.get_json()

        assistance = body.get('assistance')
        order_id = get_jwt_claims().get('order')
        table_id = body.get('table')


        if (not order_id and not table_id):
            abort(400, 'Invalid request')
        elif (not order_id):
            order_id = db.get_order_id(table_id)
        elif (not table_id):
            table_id = db.get_table_id(order_id)

        if (not order_id or not table_id):
            abort(401, 'Unauthorised')

        if (assistance != True and assistance != False):
            abort(400, 'Invalid request')


        if (not db.set_assistance(table_id, assistance)):
            abort(400, 'Something went wrong')

        socket.emit('assistance', { 'table': table_id }, room='staff1')
        #socket.emit('assistance', room='staff3')
        return jsonify({ 'status': 'success' })

        
@table.route('/paid')
class TablePaid(Resource):
    @jwt_required
    @table.response(200, 'Success', model=response_model.table_paid_response_model)
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    def get(self):
        # Return a list of tables that have paid
        paid = db.get_paid_tables()
        if (paid == None):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'tables': paid })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.expect(request_model.table_paid_model)
    def put(self):
        # Set the payment status of an order as true/false
        body = request.get_json()

        paid = body.get('paid')
        table = body.get('table')

        if (paid == None or table == None):
            abort(400, "Invalid request. Missing required field")
        
        if (db.set_paid(table, paid) == None):
            abort(500, 'Something went wrong.')
        
        return jsonify({ 'success': 'success' })

@table.route('/bill')
class TableBill(Resource):
    @jwt_required
    @table.response(200, 'Success', model=response_model.table_bill_response_model)
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    def get(self):
        # Return a list of tables that have paid
        paid = db.get_bill_tables()
        if (paid == None):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'tables': paid })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.expect(request_model.table_bill_model)
    def put(self):
        # Set the request bill status of an order as true/false
        body = request.get_json()

        bill = body.get('bill')
        order_id = get_jwt_claims().get('order')
        table_id = body.get('table')


        if (not order_id and not table_id):
            abort(400, 'Invalid request')
        elif (not order_id):
            order_id = db.get_order_id(table_id)
        elif (not table_id):
            table_id = db.get_table_id(order_id)

        if (bill == None or table_id == None):
            abort(400, "Invalid request. Missing required field")
        
        if (db.set_bill(table_id, bill) == None):
            abort(500, 'Something went wrong.')
        
        return jsonify({ 'success': 'success' })

