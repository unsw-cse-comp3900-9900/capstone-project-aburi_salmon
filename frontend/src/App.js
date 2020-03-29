import React from 'react';
import { Route, Router, Switch } from "react-router-dom";
import './App.css';
import { MuiThemeProvider } from "@material-ui/core/styles";

import history from './history';
import { Home, Login, Staff, Table, Menu, Waiting } from "./pages";
import { theme } from './theme/theme';

class App extends React.Component {
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