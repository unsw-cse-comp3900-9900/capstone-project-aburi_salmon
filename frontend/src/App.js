import React from 'react';
import { Route, Router, Switch } from "react-router-dom";
import './App.css';
import { MuiThemeProvider } from "@material-ui/core/styles";

import history from './history';
import { Home, Login, Staff, Table } from "./pages";
import { theme } from './theme/theme';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history} >
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/staff" component={Staff} />
            <Route path="/table" component={Table} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}


export default App;