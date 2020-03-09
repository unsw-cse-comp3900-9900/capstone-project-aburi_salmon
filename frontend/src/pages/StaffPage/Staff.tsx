import React from 'react';
import backbut from './../../assets/BackIcon.png';
import './../Login/LoginRegister.css';
import {connect} from 'react-redux';

/*
interface IProps {
    exact?: boolean;
    isAuthenticated: boolean | null;
    path: string;
    component: React.ComponentType<any>;
}

const LoggedInRoute = ({
    component: Component,
    isAuthenticated,
    ...otherProps
}: IProps) => {
    if (isAuthenticated === false) {
        history.push("/log-in");
        alert("this is a logged in route, you are logged out, redirected to log in");
}

    return(
        <div>
            <a href="/LoginRegister">
            <img src={backbut} alt="Back" className="back"></img>
            </a>
            <h1> Welcome </h1>
            <p> Your password is </p>
        </div>
    );
};
    const mapStateToProps = (state: ICurrent) => ({
    isAuthenticated: state.isAuthenticated
    });

    export default connect(
    mapStateToProps
    )(LoggedInRoute);

*/
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