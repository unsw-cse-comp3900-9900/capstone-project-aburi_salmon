import React from 'react';
import backbut from './../../assets/BackIcon.png';
import './../Login/LoginRegister.css';



function Staff() {
    return (
        <div>
            <BackButton />
        <h1> Welcome </h1>
        <p> Your password is </p>
    </div>
    );
}

function BackButton() {
    return (
        <a href="/LoginRegister">
            <img src={backbut} alt="Back" className="back"></img>
        </a>
    );
}

export default Staff;