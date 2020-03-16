import React from 'react';
import './../Login/LoginRegister.css';
import backbut from './../../assets/backbut2.png';
import { LoginForm } from './../Login/LoginForm';
import { RegisterForm } from './../Login/RegisterForm';

class PureLogin extends React.Component {
  render() {
    return (
      <div>
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