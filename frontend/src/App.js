import React from 'react';
import { Route, Router, Switch } from "react-router-dom";
import './App.css';
import { MuiThemeProvider } from "@material-ui/core/styles";
import history from './history';
import { Home, Login, Staff, Table, Menu, Waiting } from "./pages";
import { theme } from './theme/theme';
import io from 'socket.io-client';

const socket = io('http://localhost:5000')

class App extends React.Component {
  componentDidMount() {
    socket.on('connect', () => {
      console.log('Connected to socket');
      console.log('Attempting to join a room...');
      socket.emit('join');
    })

    socket.on('join', ({ room }) => {
      this.setState({ room: room });
      console.log(`Joined room ${room}`);
    });

    socket.on('leave', () => {
      console.log(`Left room ${this.state.room}`);
      this.setState({ room: false });
    });
  }

  render() {
    // I couldn't put MuiThemeProvider if this file is moved to a .tsx file
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history} >
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/staff" component={Staff} />
            <Route path="/table" component={Table} />
            <Route path="/menu" component={Menu} />
            <Route path="/waiting" component={Waiting} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}


export default App;