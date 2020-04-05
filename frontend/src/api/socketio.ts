import io from 'socket.io-client';
import App from '../App';

export let socket: any;

interface RoomObject {
    room: string
}

export const connectToSocket = (App: App) => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Connected to socket');
        console.log('Attempting to join a room...');
        socket.emit('join');
    });
    
    socket.on('join', ({ room }: RoomObject) => {
        console.log(`Joined room ${room}`);
        App.setState({ room: room });
    });

    socket.on('leave', () => {
        console.log(`Left room ${App.state.room}`);
        App.setState({ room: false });
    });
};