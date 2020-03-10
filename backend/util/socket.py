from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from app import flask_app

socket = SocketIO(flask_app, cors_allowed_origins="*")

## Example socketIO implementation. Do not use this
@socket.on('join')
def on_join(data):
    user = data['user']
    room = data['room']
    join_room(room)
    send(user['name'] + ' has entered room ' + room, room=room)


@socket.on('leave')
def on_leave(data):
    user = data['user']
    room = data['room']
    leave_room(room)
    send(user['name'] + ' has left room ' + room, room=room)
