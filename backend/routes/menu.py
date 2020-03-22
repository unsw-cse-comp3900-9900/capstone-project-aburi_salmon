from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import get_jwt_claims, jwt_required

from app import api, db
from model.request_model import *

menu = api.namespace('menu', description='Menu Route')

@menu.route('/')
class Menu(Resource):
    @jwt_required
    @menu.response(200, 'Success')
    @menu.response(400, 'Invalid request')
    def get(self):

        categories = db.get_category(0)
        lists = []

        for index in range(len(categories)):
           for key in categories[index]:
                if(key == 'name'): 
                    cat = categories[index][key]
                    item = db.get_item_from_category(cat)
                    myDict = {}
                    myDict['cat'] = cat
                    myDict['item'] = item
                    #print(myDict)
                    lists.append(myDict)
        
        #print(lists)

        return { 'menu': lists }


        

    
        
