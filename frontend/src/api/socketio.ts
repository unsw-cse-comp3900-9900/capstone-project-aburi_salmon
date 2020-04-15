import io from 'socket.io-client';
import App from '../App';

export let socket: any;

interface RoomObject {
    room: string;
}

interface TableObject {
    table: string;
    itemNo: string;
    modifications: string;
    deletions: string;

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

    socket.on('assistance', ({table}:TableObject) => {
        console.log(`Table ${table} is requesting assistance`);
    });

    socket.on('order', ({table}:TableObject)  => {
        console.log(`Table ${table} has placed an order`);
    });

    socket.on('modify', ({modifications}:TableObject) => {
        console.log(`${modifications}`);
    });

    socket.on('delete', ({deletions}:TableObject) => {
        console.log(`${deletions}`);
    });


    socket.on('cooking', () => {
        console.log(`Your item is cooking`);
    });

    socket.on('ready', () => {
        console.log(`Your item is ready to serve`);
    });

};

export const kitchenSocket = (App: any) => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Connected to socket');
        console.log('Attempting to join a room...');
        socket.emit('join');
    });

    socket.on('join', ({ room }: RoomObject) => {
        console.log(`Joined room ${room}`);
    });

    socket.on('leave', () => {
        console.log(`Left room ${App.state.room}`);
    });

    socket.on('order', ({ table }: TableObject) => {
        console.log(`Table ${table} has placed an order`);
        App.updateOrders();
    });

    socket.on('modify', ({ modifications }: TableObject) => {
        console.log(`${modifications}`);
        App.updateOrders();
    });

    socket.on('delete', ({ deletions }: TableObject) => {
        console.log(`${deletions}`);
        App.updateOrders();
    });


    socket.on('cooking', () => {
        console.log(`Item is cooking`);
        App.updateOrders();
    });

    socket.on('ready', () => {
        console.log(`Item is ready to serve`);
        App.updateOrders();
    });

    socket.on('served', () => {
        console.log(`Item has been served`);
        App.updateOrders();
    })

};

export const manageWaitSocket = (App: any) => {
    socket = io('http://localhost:5000');

    socket.on('connect', () => {
        console.log('Connected to socket');
        console.log('Attempting to join a room...');
        socket.emit('join');
    });

    socket.on('join', ({ room }: RoomObject) => {
        console.log(`Joined room ${room}`);
        App.updateAssist();
    });

    socket.on('leave', () => {
        console.log(`Left room ${App.state.room}`);
        App.updateAssist();
    });

    socket.on('assistance', ({ table }: TableObject) => {
        console.log(`Table ${table} is requesting assistance`);
        App.updateAssist();
        App.assistanceAlert();
    });

    socket.on('billrequest', () => {
        console.log(`Table is requesting bill`);
        App.billrequestAlert();
    });

    socket.on('order', ({ table }: TableObject) => {
        console.log(`Table ${table} has placed an order`);
        App.updateOrders();
        App.updateAssist();
    });

    socket.on('modify', ({ modifications }: TableObject) => {
        console.log(`${modifications}`);
        App.updateOrders();
    });

    socket.on('delete', ({ deletions }: TableObject) => {
        console.log(`${deletions}`);
        App.updateOrders();
    });


    socket.on('cooking', () => {
        console.log(`Your item is cooking`);
        App.updateOrders();
    });

    socket.on('ready', () => {
        console.log(`Your item is ready to serve`);
        App.updateOrders();
    });

    socket.on('served', () => {
        console.log(`Item has been served`);
        App.updateOrders();
    })
};
