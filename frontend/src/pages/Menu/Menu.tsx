import React from 'react';
import './../Login/LoginRegister.css';

import backbut from './../../assets/BackIcon.png';

class Menu extends React.Component{
        renders(){
            return (
            <div>
                <a href="/">
                    <img src={backbut} alt="Back" className="back"></img>
                </a>
                <h1>Menu will be here ~ </h1>
            </div>
        );
    }
}

export default Menu;