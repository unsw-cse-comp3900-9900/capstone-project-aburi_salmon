import React from 'react';
import backbut from './../../assets/BackIcon.png';
import './../Login/LoginRegister.css';

class Staff extends React.Component{
    render(){
        return (
            <div>
                <a href="/LoginRegister">
                    <img src={backbut} alt="Back" className="back"></img>
                </a>
                <h1> Welcome </h1>
                <p> Your password is </p>
            </div>
        );

    }
}


export default Staff;