import pdb

from flask import request, jsonify
from flask_restx import Resource, abort, reqparse, fields
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies

import config
from app import api, db
from model.request_model import *
from util.hasher import hash_password
from util.user import User

import uuid



@auth.route('/kitchen', strict_slashes=False)
class Kitchen(Resource):
    def get(self):
        # Initialise database

        ordered_items = db.orders(username)



    def beginCooking(item_id):
        db.beginCooking(item_id)
                  
    def finishCooking(self):
        db.finish_Cooking(item_id)



