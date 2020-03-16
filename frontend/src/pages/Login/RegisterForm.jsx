
import React from 'react';
import './../Login/LoginRegister.css';
import { TextField, Button, Snackbar } from '@material-ui/core';
import history from './../../history';
import { Alert } from '@material-ui/lab';

class PureRegister extends React.Component {

    constructor(props) {
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
            passerror: false,
        }
    }

    checkRegister(){
        fetch("/auth/signup", {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                registration_key:  this.state.key,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        }).then((msg) => {
            //alert(msg.status);
            if (msg.status === 200) {
                alert('You have signed up successfully, please try to log in');
                this.context.logIn(this.state.username);
                localStorage.setItem('username', null);
                localStorage.setItem('staff', 'false');
                history.push('/');
            } else {
                alert(msg.statusText);
            }
        }).catch((status) => {
            console.log(status);
        });
    }

    setError(message){
        this.setState({ isOpen: true});
        this.setState({ alertMessage: message });
        this.setState({ severity: 'error' });
    }

    resetError(){
       this.setState({error: false});
       this.setState({passerror: false}); 
    }

    handleRegister(e){
        e.preventDefault();
        //If any fields are empty
        this.resetError();
        console.log('username: ' + this.state.username);
        if (this.state.username === '' || this.state.password === '' || this.state.name === ''){
            this.setError('All fields must be filled in');
            this.setState({error: true});
            this.setState({ passerror: true });
        } else if (this.state.repassword === '' || this.state.key === ''){
            this.setError('All fields must be filled in');
            this.setState({error: true});
            this.setState({passerror: true });
        } else if (this.state.repassword !== this.state.password) {
            this.setError('Passwords not consistent');
            this.setState({ passerror: true })
        } else {
            this.checkRegister();
        }
    }

    render(){
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
                            id="name"
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
                            id="username"
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
                            id="password"
                            placeholder="password"
                            type="password"
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
                            type= "password"
                            onChange={(e) => this.setState({ key: e.target.value })}
                            placeholder="key"
                        />
                    </div>

                    <br></br>
                        <button className=" loginbut "
                            onClick = {(e) => this.handleRegister(e)}
                            > Register </button>
            
            </div>
        );
    }
}

export const RegisterForm = PureRegister;
