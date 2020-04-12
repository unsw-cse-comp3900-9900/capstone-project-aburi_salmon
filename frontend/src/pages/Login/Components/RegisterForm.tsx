
import React from 'react';
import './../LoginRegister.css';
import { TextField, Button, Snackbar } from '@material-ui/core';
import history from './../../../history';
import { Alert, Color } from '@material-ui/lab';

interface IState {
    username: string;
    name: string;
    password: string;
    repassword: string;
    key: string;
    passerror: boolean;
    error: boolean;
    severity: Color;
    isOpen: boolean;
    alertMessage: string;
}

class PureRegister extends React.Component<{}, IState> {
    // If Props is specified, use React.Component<IProps, IState>
    constructor(props: any) {
        super(props);
        this.state = {
            username: 'Hey',
            name: '',
            password: '',
            repassword: '',
            key: '',
            passerror: false,
            error: false,
            severity: 'success',
            isOpen: false,
            alertMessage: '',
        }
    }

    checkRegister() {
        fetch("http://localhost:5000/auth/signup", {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
                registration_key: this.state.key,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
            credentials: 'include',
            mode: 'cors',
        })
        .then(res => {
            var temp = this;
            if (res.status === 200){
                alert('You have signed up successfully, please try to log in');
                localStorage.setItem('username', "");
                localStorage.setItem('staff', 'false');
                history.push('/');
            } else {
                res.json().then(function(object){
                    temp.setError(object.message);
                });
            }
        }).catch((status) => {
            console.log(status);
        });
    }

    setError(message: string) {
        this.setState({ isOpen: true });
        this.setState({ alertMessage: message });
        this.setState({ severity: 'error' });
    }

    resetError() {
        this.setState({ error: false });
        this.setState({ passerror: false });
    }

    /*
    Current error handling
    - Everthing must be filled in
    - Name must be only letters and spaces
    - Password must have at least one letter and number
    */

    handleRegister(e: React.MouseEvent) {
        e.preventDefault();
        //If any fields are empty
        this.resetError();
        console.log('username: ' + this.state.username);
        if (this.state.username === '' || this.state.password === '' || this.state.name === '') {
            this.setError('All fields must be filled in');
            this.setState({ error: true });
            this.setState({ passerror: true });
        } else if (this.state.repassword === '' || this.state.key === '') {
            this.setError('All fields must be filled in');
            this.setState({ error: true });
            this.setState({ passerror: true });
        } else if (this.state.repassword !== this.state.password) {
            this.setError('Passwords not consistent');
            this.setState({ passerror: true });
        } else if (!/^[a-zA-Z/s]+$/.test(this.state.name)) {
            this.setError('Username can only be letters')
            this.setState({ error: true });
            this.setState({ passerror: true });
        } else if (/^[a-zA-Z/s]+$/.test(this.state.password)) {
            this.setError('Password must contain at least one number');
            this.setState({ passerror: true });
        } else if (/^[0-9/s]+$/.test(this.state.password)) {
            this.setError('Password must contain at least one letter');
            this.setState({ passerror: true });
        } else if (!/^[a-zA-Z0-9/s]+$/.test(this.state.password)) {
            this.setError('Password can only contain letters, numbers and spaces');
            this.setState({ passerror: true });
        } else {
            this.checkRegister();
        }
    }

    render() {
        return (
            <div className="signupbox">
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
                <h1><b> New Staff</b></h1>
                
                <div>
                    Name:
                        <br></br>
                    <TextField
                        id="rname"
                        onChange={(e) => this.setState({ name: e.target.value })}
                        placeholder="name"
                        error={this.state.error}
                    />
                </div>
                <br></br>
                <div>
                    Username:
                        <br></br>
                    <TextField
                        id="rusername"
                        onChange={(e) => this.setState({ username: e.target.value })}
                        placeholder="username"
                        error={this.state.error}
                    />
                </div>

                <div>
                    <br></br>
                        Password:
                        <br></br>
                    <TextField
                        id="rpassword"
                        placeholder="password"
                        type="password"
                        autoComplete="off"
                        error={this.state.passerror}
                        onChange={(e) => this.setState({ password: e.target.value })}
                    />
                </div>
                <div>
                    <br></br>
                        Re-enter Password:
                                <br></br>
                    <TextField
                        id="repassword"
                        type="password"
                        autoComplete="off"
                        error={this.state.passerror}
                        onChange={(e) => this.setState({ repassword: e.target.value })}
                        placeholder="repassword"
                    />
                </div>
                <div>
                    <br></br>
                        Key:
                        <br></br>
                    <TextField
                        id="key"
                        error={this.state.error}
                        type="password"
                        autoComplete="off"
                        onChange={(e) => this.setState({ key: e.target.value })}
                        placeholder="key"
                    />
                </div>

                <br></br>
                <button className=" loginbut "
                    onClick={(e: React.MouseEvent) => this.handleRegister(e)}
                > Register </button>
               

            </div>
        );
    }
}

export const RegisterForm = PureRegister;
