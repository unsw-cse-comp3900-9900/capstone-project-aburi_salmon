import React from 'react';
import './../Login/LoginRegister.css';
import backbut from './../../assets/BackIcon.png';
import {LoginForm} from './../../components/LoginForm';
import {RegisterForm} from './../../components/RegisterForm';


class LoginRegister extends React.Component{
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

export default LoginRegister;
