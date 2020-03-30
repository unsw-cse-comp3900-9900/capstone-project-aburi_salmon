from flask import request, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_jwt_extended import get_jwt_claims, get_jwt_identity, jwt_required, jwt_optional

from app import flask_app

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
@jwt_required
def staff_join_room():
    claims = get_jwt_claims()
    user = get_jwt_identity()
    if (claims.get('role')):
        room = claims.get('role')
    elif (claims.get('order')):
        room = claims.get('order')
    
    print('joining room {}'.format(room))
    join_room(room)
    emit('join', { 'room': room })

@socket.on('leave')
@jwt_required
def on_leave(data):
    claims = get_jwt_claims()
    user = get_jwt_identity()
    if (claims.get('role')):
        room = claims.get('role')
    elif (claims.get('order')):
        room = claims.get('order')
    print('User {} has left room {}'.format(user, room))
    leave_room(room)
    emit('leave')
