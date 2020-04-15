import React from 'react';
import { TextField, Button, Snackbar } from '@material-ui/core';
import { Color } from '@material-ui/lab';
import './../LoginRegister.css';
import history from './../../../history';
import { Alert } from '@material-ui/lab';
import { Client } from './../../../api/client';
import {StaffLogin } from './../../../api/models';

interface IState {
    username: string;
    password: string;
    usererror: boolean;
    passerror: boolean;
    severity: Color;
    isOpen: boolean;
    alertMessage: string;
}

class PureLogin extends React.Component<{}, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: '',
            usererror: false, //used to highlight username error
            passerror: false, //used to highlight password error
            isOpen: false, //open snackbar alert
            severity: 'success', //type of alert
            alertMessage: 'None', //displayed message
        }
    }

    async checkLogin() {
        const client = new Client();
        const r: StaffLogin | null = await client.login(this.state.username, this.state.password);
        if (r !== null && r.status === 'success'){
            alert('you have successfully logged on');
            localStorage.setItem('username', this.state.username);
            localStorage.setItem('staff', 'true');
            if (r.staffype === 1){
                localStorage.setItem('stafftype', 'waiter');
            } else if (r.staffype === 2){
                localStorage.setItem('stafftype', 'kitchen');
            } else if (r.staffype === 3){
                localStorage.setItem('stafftype', 'admin');
            }
            this.loginSuccess();
            history.push('/staff');
        } else {
            this.setError('Incorrect username/password');
        }
    }

    loginSuccess() {
        //return (<Alert severity="success">This is a success message!</Alert>);
        this.setState({ isOpen: true });
        this.setState({ alertMessage: "You have successfully logged in" });
        this.setState({ severity: 'success' });
        console.log(`${localStorage.getItem('username')} just logged in`);
        console.log('attempting to join room');
    }

    setError(message: string) {
        this.setState({ isOpen: true });
        this.setState({ alertMessage: message });
        this.setState({ severity: 'error' });
    }

    /*
    Current Checks:
    - Username and password aren't empty
    - Username consist of only letters or spaces
    */

    resetError() {
        this.setState({ passerror: false });
        this.setState({ usererror: false });
    }

    handleLogin() {
        this.resetError();
        if (this.state.username === '' && this.state.password === '') {
            this.setError('All fields need to be filled');
            this.setState({ passerror: true });
            this.setState({ usererror: true });
        } else if (this.state.password === '') {
            this.setError('Password Required');
            this.setState({ passerror: true });
        } else if (this.state.username === '') {
            this.setError('Username Required');
            this.setState({ usererror: true });
        } else if (!/^[a-zA-Z/s]+$/.test(this.state.username)) {
            this.setError('Username can only be letters or spaces')
            this.setState({ usererror: true });
        } else {
            this.checkLogin();
        }
    }

    render() {
        return (
            <div className="loginbox">
                <Snackbar
                    open={this.state.isOpen}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        severity={this.state.severity}
                        action={
                            <Button color="inherit" size="small" onClick={() => this.setState({ isOpen: false })}>
                                OK
                            </Button>
                        }
                    >{this.state.alertMessage}</Alert>
                </Snackbar>
                {/*<img src={restlogo} className="logoimage" alt="logo" />*/}
                <h1><b>Login</b></h1>
                
                Username: <br></br>
                <TextField
                    id="username"
                    onChange={(e) => this.setState({ username: e.target.value })}
                    placeholder="username"
                    error={this.state.usererror}
                    size="small"
                />

                <br></br>
                <br></br>
                Password: <br></br>
                <TextField
                    id="password"
                    type="password"
                    placeholder="password"
                    autoComplete="off"
                    error={this.state.passerror}
                    size="small"
                    onChange={(e) => this.setState({ password: e.target.value })}
                />
                <br></br>

                <button className=" loginbut "
                    onClick={() => { this.handleLogin() }}
                >Login</button>
                
            </div>
        );
    }
}

export const LoginForm = PureLogin;