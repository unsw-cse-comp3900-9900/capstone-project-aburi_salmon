import React from 'react';
import './../Home/Homepage.css';
import restlogo from './../../assets/Hojiak.png';
import history from './../../history';


//https://github.com/cornflourblue/react-jwt-authentication-example/blob/master/src/HomePage/HomePage.jsx
//This one --> https://medium.com/octopus-wealth/authenticated-routing-with-react-react-router-redux-typescript-677ed49d4bd6
//https://github.com/cornflourblue/react-jwt-authentication-example


class Home extends React.Component {
    

    start(){
        return (
            <button className="myButton"
                onClick = {() => history.push('/menu') }
            > Start Ordering </button>
        );
    }


    login() {
        return (
            <a href="/loginregister">
                <div className="stafflogin"><u>Staff login</u></div>
            </a>
        );
    }

    render() {
        return (
            <div className="wrapper">
                <img src={restlogo} className="restlogo" alt="Logo" />
                {this.start()}
                {this.login()}
            </div>
        );
    }
}

/*
function Start() {
    return (
        <button className="myButton"
            onClick={() => history.push('/menu')}
        > Start Ordering </button>
    );
}

function Login(){
    return (
        <a href="/loginregister">
            <div className="stafflogin"><u>Staff login</u></div>
        </a>
    );
}


function Home(){
    return (
        <div className="wrapper">
            <img src={restlogo} className="restlogo" alt="Logo" />
            <Start />
            <Login />
        </div>
    );
}
*/

export default Home;




