import React from 'react';
import { Route, Router, Switch } from "react-router-dom";
import './App.css';
import history from './history';
import { Home, Login, Staff } from "./pages";


class App extends React.Component {
    render() {
        return(
            <Router history = { history } >
                <Switch>
                    <Route path = "/" exact component = { Home }/> 
                    <Route path = "/login" component = { Login }/>
                    <Route path = "/staff" component = { Staff }/>
                </Switch>
            </Router>

        );
    }
}


export default App;