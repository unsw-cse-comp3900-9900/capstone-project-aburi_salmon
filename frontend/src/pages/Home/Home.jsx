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


  logOut() {
    localStorage.setItem('username', null);
    localStorage.setItem('staff', 'false');
    fetch("/auth/logout", {
      method: 'POST',
    }).then((msg) => {
      if (msg.status === 200) {
        alert('you have successfully logged out');
      } else {
        alert('msg.status');
      }
    }).catch((status) => {
      console.log(status);
    });
    history.push('/');
  }

  isLoggedIn(){
    if (localStorage.getItem('staff') !== 'true') {
      return(
        <Link className="stafflogin" variant="h5" color="inherit" onClick={() => this.goToLogin()}>
            Log In
          </Link>
      );
    }
    else {
      return(
      <Link className="stafflogin" variant="h5" color="inherit" onClick={() => this.logOut()}>
        Log Out
          </Link>
      );
    }
    
  }

  render() {
    return (
      <div className="wrapper">
        {/*<img src={restlogo} className="restlogo" alt="Logo" />*/}
          <h1 className="restlogo">Restuarant Name</h1>
          <button className="myButton" onClick={() => this.goToTable()}>
            Start Ordering
          </button>
          {this.isLoggedIn()}
          
      </div>
    );
  }
}

export const Home = PureHome;


