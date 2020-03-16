import React from 'react';
import { Link } from 'react-router-dom';
import './../Home/Homepage.css';
import history from './../../history';
//import restlogo from './../../assets/Hojiak.png';


class PureHome extends React.Component {
  goToMenu() {
    history.push('/menu');
  }

  goToLogin() {
    history.push('/login');
  }

  render() {
    return (
      <div className="wrapper">
        {/*<img src={restlogo} className="restlogo" alt="Logo" />*/}
          <h1 className="restlogo">Restuarant Name</h1>
          <button className="myButton" onClick={() => this.goToMenu()}>
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


