import io from 'socket.io-client';
import App from '../App';

export let socket: any;

interface RoomObject {
    room: string;
    table: string
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

    socket.on('leave', () => {
        console.log(`Left room ${App.state.room}`);
        App.setState({ room: false });
    });

    socket.on('assistance', () => {
        console.log(`Table is requesting assistance`);
    });

    socket.on('order', (data : any) => {
        console.log(`Customer has ordered an item `);
    });

    socket.on('modify', () => {
        console.log(`Customer has modified an item`);
    });

    socket.on('delete', () => {
        console.log(`Customer has deleted an item`);
    });

    socket.on('cooking', () => {
        console.log(`Your item is cooking`);
    });

    socket.on('ready', () => {
        console.log(`Your item is ready to serve`);
    });

};