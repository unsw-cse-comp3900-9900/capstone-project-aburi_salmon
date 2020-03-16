import React from 'react';
import { Link } from 'react-router-dom';
import './../Home/Homepage.css';
import history from './../../history';
//import restlogo from './../../assets/Hojiak.png';


class PureHome extends React.Component {
  goToTable() {
    history.push('/table');
  }

  goToLogin() {
    history.push('/login');
  }

  render() {
    return (
      <div className="wrapper">
        {/*<img src={restlogo} className="restlogo" alt="Logo" />*/}
          <h1 className="restlogo">Restuarant Name</h1>
          <button className="myButton" onClick={() => this.goToTable()}>
            Start Ordering
          </button>
          <Link className="stafflogin" variant="h5" color="inherit" onClick={() => this.goToLogin()}>
            Log In
          </Link>
      </div>
    );
  }
}

export const Home = PureHome;


