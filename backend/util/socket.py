from flask import request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import get_jwt_claims, get_jwt_identity, jwt_required, jwt_optional

from app import flask_app

from app import flask_app
from app import api, db

from db.table_db import table_DB
table_db = table_DB(db)

socket = SocketIO(flask_app, cors_allowed_origins="*")

@socket.on('connect')
def connect():
    print('client connected')

@socket.on('disconnect')
@jwt_required
def disconnect():
    user = get_jwt_identity()
    print('{} disconnected'.format(user))
    

## Example socketIO implementation. Do not use this
@socket.on('join')
@jwt_optional
def on_join():
    print('Attempting to join room')
    claims = get_jwt_claims()
    user = get_jwt_identity()
    if (claims.get('role')):
        room = 'staff' + str(claims.get('role'))
    elif (claims.get('order')):
        room = 'customer' + str(claims.get('order'))
    else:
        # User is not logged in
        return
    
    print('joining room {}'.format(room))
    join_room(room)
    emit('join', { 'room': room })

@socket.on('leave')
@jwt_required
def on_leave():
    claims = get_jwt_claims()
    user = get_jwt_identity()
    if (claims.get('role')):
        room = claims.get('role')
    elif (claims.get('order')):
        room = claims.get('order')
    print('User {} has left room {}'.format(user, room))
    leave_room(room)
    emit('leave')

'''
@socket.on('table')
@jwt_required
def select_table():
    print("The client is choosing a table")
    claims = get_jwt_claims()
    room = claims.get('role')
    print("sending to room {}".format(room))
    emit('table', room=None, include_self=True, namespace=None, callback=None)
'''

@socket.on('order')
@jwt_required
def order_item():
    print("The client has placed an order")


@socket.on('cooking')
@jwt_required
def staff_is_cooking():
    print("The staff have begun preparing the order")

@socket.on('finished')
@jwt_required
def staff_finished():
    print("The staff have finished cooking your order")


@socket.on('assistance')
@jwt_required
def request_assistance():
    orderNumber = get_jwt_claims().get('order')
    table = table_db.get_order_id(orderNumber)
    print("Customer from table {} is requesting assistance".format(table))
    emit('assistance', { 'table': table })

@socket.on('Bill Request')
@jwt_required
def bill_request():
    print("Bill requested")
