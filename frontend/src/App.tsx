import React from 'react';
import './App.css';
import { Router, Switch, Route} from 'react-router-dom';
import Home from './pages/Home/Homepage';
import LoginRegister from './pages/Login/LoginRegister';
import Menu from './pages/Menu/Menu';
import Staff from './pages/StaffPage/Staff';
import history from './history';

import { checkAuthentication } from "./actions/current";
import { ICurrent } from "./types";

import LoggedInRoute from "./routes/LoggedInRoute";
import LoggedOutRoute from "./routes/LoggedOutRoute";

// Declaring pages
// Need to add history
// https://stackoverflow.com/questions/42672842/how-to-get-history-on-react-router-v4

/*

interface IProps {
  checkAuthenticationConnect: () => void;
  isAuthenticated: boolean | null;
}

const App = ({
  checkAuthenticationConnect,
  isAuthenticated
}: IProps) => {
  React.useEffect(() => {
    checkAuthenticationConnect();
  }, []);

  const app = isAuthenticated !== null ? (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/loginregister" component={LoginRegister}/>
        <Route path="/menu" component={Menu} />
        <LoggedInRoute path="/staff" component={Staff} />
      </Switch>
    </Router>
  ) : null;

  return (
    <div className="App">
      {app}
    </div>
  );
}

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated
});

const mapDispatchToProps = {
  checkAuthenticationConnect: checkAuthentication
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

*/


function App(){
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


export default App;
