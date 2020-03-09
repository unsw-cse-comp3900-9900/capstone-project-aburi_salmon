import React from 'react';
import './../Login/LoginRegister.css';

import backbut from './../../assets/BackIcon.png';



function Menu(){
    return (
        <div>
        <BackButton />
        <h1>Menu will be here ~ </h1>
        </div>
    );
}

function BackButton() {
    return (
        <a href="/">
            <img src={backbut} alt="Back" className="back"></img>
        </a>
    );
}

export default Menu;