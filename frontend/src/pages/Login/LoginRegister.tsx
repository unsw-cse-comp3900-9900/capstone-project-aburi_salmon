import React from 'react';
import './../Login/LoginRegister.css';
import backbut from './../../assets/BackIcon.png';
import {LoginForm} from './../../components/LoginForm';
import {RegisterForm} from './../../components/RegisterForm';


function BackButton(){
    return (
        <a href="/">
            <img src={backbut} alt="Back" className="back"></img>
        </a>
    );
}


function LoginRegister(){
    return (
        <div>
            <BackButton />
            <LoginForm />
            <div className="vl "></div>
            <RegisterForm />
        </div>
    );
}

export default LoginRegister;
