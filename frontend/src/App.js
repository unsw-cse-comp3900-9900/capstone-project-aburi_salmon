import React from 'react';
import { Route, Router, Switch } from "react-router-dom";

import './App.css';
import history from './history';
import {Home, Login} from "./pages";


function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
