import React from 'react';
import './../Login/LoginRegister.css';
import backbut from './../../assets/backbut2.png';
import { LoginForm } from './Components/LoginForm';
import { RegisterForm } from './Components/RegisterForm';
import history from '../../history';

class PureLogin extends React.Component {

  loggedIn(){
    if (localStorage.getItem('staff') === 'true'){
      alert('You are already logged in');
      history.push('/staff');
    }
  }

  render() {
      return (
        <div>
          {this.loggedIn()}
          <a href="/">
            <img src={backbut} alt="Back" className="back"></img>
          </a>
          <LoginForm />
          <div className="vl "></div>
          <RegisterForm />
        </div>
      );
  }
}

export const Login = PureLogin;
// export default PureLogin;