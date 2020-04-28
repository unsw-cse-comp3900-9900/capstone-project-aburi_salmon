from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from db.table_db import table_DB

import model.table_model as table_model

from util.socket import socket

table_db = table_DB(db)
table = api.namespace('table', description='Table Route')

@table.route('/')
class Table(Resource):
    @table.response(200, 'Success', model=table_model.tables_response_model)
    @table.response(500, 'Failed to fetch tables')
    @table.doc(description="Get a list of tables and their status (occupied or not?)")
    def get(self):
        tables = table_db.get_tables()
        if tables is None:
            abort(500, 'Failed to fetch tables')
        return jsonify({ 'tables': tables })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(500, 'Failed to add table')
    @table.expect(table_model.table_request_model)
    @table.doc(description="Create a new table")
    def post(self):
        # Make sure user is a manager
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')

        # Validate table number from payload
        table = request.get_json().get('table')
        if (not table):
            abort(400, 'Table number not provided')

        # Create new table
        if (not table_db.create_table(table)):
            abort(500, 'Failed to add table')

        return jsonify({ 'status': 'success' })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.doc(description="Delete the highest numbered table")
    def delete(self):
        # Make sure user is a manager
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) != 'Manage':
            abort(400, 'User is not a manager')
        
        # Delete table
        if (not table_db.delete_table()):
            abort(500, 'Failed to delete table')

        return jsonify({ 'status': 'success' })

@table.route('/orders/<int:table>')
class TableOrders(Resource):
    @jwt_required
    @table.response(200, 'Success', model=table_model.table_order_response_model)
    @table.response(400, 'Invalid request')
    @table.response(500, 'Something went wrong')
    @table.doc(description="Get the order of the table")
    def get(self, table):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) not in ('Manage', 'Wait'):
            abort(400, 'User is not a waitstaff or manager')

        # Get current order_id of the table
        order_id = table_db.get_order_id(table)

        # Make sure order_id exists
        if (not order_id):
            abort(400, 'No orders for this table')

        # Get items ordered in the table's current session
        order_items = table_db.get_ordered_items(order_id)
        if (order_items is None):
            abort(500, 'Something went wrong')

        # Calculate total cost of items ordered on current table session
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
    @table.response(500, 'Something went wrong')
    @table.doc(description="Set table as free")
    def post(self, table):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) not in ('Manage', 'Wait'):
            abort(400, 'User is not a waitstaff or manager')

        # Set table free
        if (not table_db.set_table_free(table)):
            abort(500, 'Something went wrong')

        print('Table #' + str(table) + ' set occupied as false')

        # get the latest orderid of table
        order_id = table_db.get_order_id(table)
        customerRoom = 'customer' + str(order_id)
        print(customerRoom)
        # Notify customer that they have paid successfully
        socket.emit('paid', room=customerRoom)
        
        return jsonify({ 'status': 'success' })

@table.route('/assistance')
class Assistance(Resource):
    @jwt_required
    @table.response(200, 'Success', model=table_model.table_assistance_response_model)
    @table.response(400, 'Invalid request')
    @table.response(500, 'Something went wrong')
    @table.doc(description="Get tables that require assistance")
    def get(self):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) not in ('Manage', 'Wait'):
            abort(400, 'User is not a waitstaff or manager')

        # Get tables that require assistance
        tables = table_db.get_assistance_tables()
        if (tables is None):
            abort(500, 'Something went wrong')

        return jsonify({'tables': tables})

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.expect(table_model.table_assistance_request_model)
    @table.doc(description="Set table assistance (true/false)")
    def put(self):
        # Make sure user is a manager, waitstaff or customer
        claims = get_jwt_claims()
        order = claims.get('order')
        role = claims.get('role')
        if db.get_staff_title(role) not in ('Manage', 'Wait') and order is None:
            abort(400, 'User is not a waitstaff, manager or customer')

        body = request.get_json()

        # Validate request and determine order_id and table_number
        assistance = body.get('assistance')
        order_id = get_jwt_claims().get('order')
        table_id = body.get('table')


        if (not order_id and not table_id):
            abort(400, 'Invalid request')
        elif (not order_id):
            order_id = table_db.get_order_id(table_id)
        elif (not table_id):
            table_id = table_db.get_table_id(order_id)

        if (not order_id or not table_id):
            abort(401, 'Unauthorised')

        if (assistance != True and assistance != False):
            abort(400, 'Invalid request')

        # Update assistance
        if (not table_db.set_assistance(table_id, assistance)):
            abort(400, 'Something went wrong')

        # Notify waitstaff
        if (assistance):
            socket.emit('assistance', { 'table': table_id }, room='staff1')

        return jsonify({ 'status': 'success' })

        
@table.route('/paid')
class TablePaid(Resource):
    @jwt_required
    @table.response(200, 'Success', model=table_model.table_paid_response_model)
    @table.response(400, 'Invalid request')
    @table.response(500, 'Something went wrong')
    @table.doc(description="Get tables that have paid but are still occupied")
    def get(self):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) in ('Manage', 'Wait'):
            abort(400, 'User is not a waitstaff or manager')

        # Return a list of tables that have paid
        paid = table_db.get_paid_tables()
        if (paid == None):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'tables': paid })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.expect(table_model.table_paid_request_model)
    @table.doc(description="Update the paid status of a table session")
    def put(self):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) in ('Manage', 'Wait'):
            abort(400, 'User is not a waitstaff or manager')

        body = request.get_json()

        # Validate request body
        paid = body.get('paid')
        table = body.get('table')
        if (paid == None or table == None):
            abort(400, "Invalid request. Missing required field")
        
        # Update payment status
        if (table_db.set_paid(table, paid) == None):
            abort(500, 'Something went wrong.')

        # Notify customer that table is paid
        customerRoom = 'customer'+ str(table)
        socket.emit('paid', room=customerRoom)
        
        return jsonify({ 'success': 'success' })

@table.route('/bill')
class TableBill(Resource):
    @jwt_required
    @table.response(200, 'Success', model=table_model.table_bill_response_model)
    @table.response(500, 'Something went wrong')
    @table.response(401, 'Invalid request')
    @table.doc(description="Get tables requesting the bill.")
    def get(self):
        # Make sure user is a manager or waitstaff
        role = get_jwt_claims().get('role')
        if db.get_staff_title(role) in ('Manage', 'Wait'):
            abort(401, 'User is not a waitstaff or manager')
        
        # Return a list of tables that have paid
        paid = table_db.get_bill_tables()
        if (paid == None):
            abort(500, 'Something went wrong')
        
        return jsonify({ 'tables': paid })

    @jwt_required
    @table.response(200, 'Success')
    @table.response(400, 'Invalid request')
    @table.response(401, 'Unauthorised')
    @table.response(500, 'Something went wrong')
    @table.expect(table_model.table_bill_request_model)
    @table.doc(description="Set bill request status.")
    def put(self):
        # Make sure user is a manager, waitstaff or customer
        claims = get_jwt_claims()
        order = claims.get('order')
        role = claims.get('role')
        if db.get_staff_title(role) not in ('Manage', 'Wait') and order is None:
            abort(400, 'User is not a waitstaff, manager or customer')

        # Validate the request body
        body = request.get_json()

        bill = body.get('bill')
        order_id = get_jwt_claims().get('order')
        table_id = body.get('table')
        if (not order_id and not table_id):
            abort(400, 'Invalid request')
        elif (not order_id):
            order_id = table_db.get_order_id(table_id)
        elif (not table_id):
            table_id = table_db.get_table_id(order_id)
        
        if (bill == None or table_id == None):
            abort(400, "Invalid request. Missing required field")
        
        # Set the request bill status of an order as true/false
        if (table_db.set_bill(table_id, bill) == None):
            abort(500, 'Something went wrong.')
        
        if bill:
            # Notify waitstaff of bill request
            socket.emit('billrequest', room='staff1')

        return jsonify({ 'success': 'success' })

