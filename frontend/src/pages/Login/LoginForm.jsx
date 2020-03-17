import React, { useEffect, useState } from 'react';
import { TextField, withStyles, Button, Snackbar } from '@material-ui/core';
import './../Login/LoginRegister.css';
import restlogo from './../../assets/Hojiak.png';
import history from './../../history';
import { Alert } from '@material-ui/lab';


class PureLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            usererror: false, //used to highlight username error
            passerror: false, //used to highlight password error
            isOpen: true, //open snackbar alert
            severity: 'success', //type of alert
            alertMessage: 'None', //displayed message
        }
    }

    checkLogin() {
        fetch("http://localhost:5000/auth/login", {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        }).then((msg) => {
            //alert(msg.status);
            if (msg.status === 200) {
                alert('You are logged in');
                localStorage.setItem('username', this.state.username);
                localStorage.setItem('staff', 'true');
                history.push('/staff');
            } else {
                this.setState({isOpen: true});
                this.alertMessage = 'Needs more than 0 character';
                alert(msg.statusText);
            }
        }).catch((status) => {
            console.log(status);
        });
    }

    setError(message){
        this.setState({isOpen: true});
        this.setState({alertMessage: message });
        this.setState({severity: 'error' });
        this.setState({passerror: true });
        this.setState({usererror: true });
        alert(message);
    }

    handleLogin() {
        if (this.state.username === '' && this.state.password === '') {
            this.setError('Needs more than 0 character');
        } else if (this.state.password === '') {
            this.setError('Needs more than 0 character');
        } else if (this.state.username === '') {
            this.setError('Needs more than 0 character');
        } else {
            this.checkLogin();
        }
    }

    render() {
        return (
            <div className="loginbox">
                <Snackbar open={this.isOpen}>
                    <Alert
                        severity={this.severity}
                        action={
                            <Button color="inherit" size="small" onClick={() => this.setState({isOpen: true})}>
                                OK
                            </Button>
                        }
                    >{this.alertMessage}</Alert>
                </Snackbar>
                {/*<img src={restlogo} className="logoimage" alt="logo" />*/}
                <h1><b>Login</b></h1>
                Username: <br></br>
                <TextField
                    id="username"
                    onChange={(e) => this.setState({ username: e.target.value })}
                    placeholder="username"
                    error={this.usererror}
                    size="small"
                />

                <br></br>
                <br></br>
                Password: <br></br>
                <TextField
                    id="password"
                    type="password"
                    placeholder="password"
                    error={this.passerror}
                    size="small"
                    onChange={(e) => this.setState({ password: e.target.value })}
                />
                <br></br>
                <br></br>
                <br></br>
                <button className=" loginbut "
                    onClick={() => { this.handleLogin() }}
                >Login</button>
            </div>
        );
    }
}


export const LoginForm = PureLogin;
