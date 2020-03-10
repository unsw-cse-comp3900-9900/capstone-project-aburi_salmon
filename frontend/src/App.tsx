import React from 'react';

import './App.css';
import { Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home/Homepage';
import LoginRegister from './pages/Login/LoginRegister';
import Menu from './pages/Menu/Menu';
import Staff from './pages/StaffPage/Staff';
import history from './history';


// Declaring pages
// Need to add history
// https://stackoverflow.com/questions/42672842/how-to-get-history-on-react-router-v4


class App extends React.Component{

  
  render(){
  return(
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/loginregister" component={LoginRegister}/>
        <Route path="/menu" component={Menu} />
        <Route path="/staff" component={Staff} />
      </Switch>
    </Router>
  )
}
}



export default App;
