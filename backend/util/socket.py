from flask import request, jsonify
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_jwt_extended import get_jwt_claims, get_jwt_identity, jwt_required

from app import flask_app

socket = SocketIO(flask_app, cors_allowed_origins="*")

@socket.on('connect')
@jwt_required
def connect():
    print('client connected')
    emit('join_room')

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
    send(room)

@socket.on('leave')
def on_leave(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    send(user['name'] + ' has left room ' + room, room=room)
