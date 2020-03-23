from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.response_model import tables_model

table = api.namespace('table', description='Order Route')

@table.route('/')
class Table(Resource):
    @table.response(200, 'Success', model=tables_model)
    @table.response(400, 'Invalid request')
    def get(self):
        tables = db.get_tables(0)
        return jsonify({ 'tables': tables })



    
        
