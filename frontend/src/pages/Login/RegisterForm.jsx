
import React from 'react';
import './../Login/LoginRegister.css';
import { TextField } from '@material-ui/core';
import history from './../../history';

class PureRegister extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            password: '',
            repassword: '',
            key: '',
            error: false,
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

    handleRegister(){
        //If any fields are empty
        if (this.username === '' || this.password === '' || this.name === ''){
            alert('All fields must be filled in');
            this.error = true;
        } else if (this.repassword === '' || this.key === ''){
            alert('All fields must be filled in');
            this.error = true;
        } else if (this.repassword !== this.password) {
            alert('Passwords not consistent');
            this.error = true;
        } else {
            this.checkRegister();
        }
    }

    render(){
        return (
            <div className="signupbox">
                <h1><b> New Staff</b></h1>
                <form>
                    <div>
                        Name:
                        <br></br>
                        <TextField
                            id="name"
                            onChange={(e) => this.setState({ name: e.target.value })}
                            placeholder="name"
                            error={this.error}
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
                            error={this.error}
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
                            error={this.error}
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
                            error={this.error}
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
                            error={this.error}
                            onChange={(e) => this.setState({ key: e.target.value })}
                            placeholder="key"
                        />
                    </div>

                    <br></br>
                        <button type="submit"
                            className=" loginbut "
                            onClick = {() => this.handleRegister()}
                            > Register </button>
                </form>
            </div>
        );
    }
}

export const RegisterForm = PureRegister;
