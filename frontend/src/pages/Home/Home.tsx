import React from 'react';
import { Link } from 'react-router-dom';
import './../Home/Homepage.css';
import history from '../../history';
import { socket } from '../../api/socketio';

//Renders the home page

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
        <h1 className="restlogo">Welcome!</h1>
        <button className="myButton" onClick={() => this.goToTable()}>
          Start Ordering
          </button>
        {isLoggedIn()}
      
      </div>
    );
  }
}

//logs staff out
const logOut = async () => {
  socket.emit('leave')
  localStorage.setItem('username', "");
  localStorage.setItem('staff', 'false');
  await fetch("http://localhost:5000/auth/logout", {
    method: 'POST',
    credentials: 'include',
    mode: 'cors'
  }).then((msg) => {
    if (msg.status === 200) {
      alert('you have successfully logged out');
    } else {
      alert(msg.status);
    }
  }).catch((status) => {
    console.log(status);
  });
  history.push('/');
}

//checks if is logged in
const isLoggedIn = () => {
  if (localStorage.getItem('staff') !== 'true') {
    return (
      <Link to='/login' className="stafflogin">
        Log In
      </Link>
    );
  }
  else {
    history.push('/staff');
  }

}

export const Home = PureHome;


