import React from 'react';
import { TextField, Button, Snackbar, WithStyles, Theme, createStyles } from '@material-ui/core';
import { Color } from '@material-ui/lab';
import './../Login/LoginRegister.css';
import restlogo from './../../assets/Hojiak.png';
import history from '../../history';
import { Alert } from '@material-ui/lab';


// const styles = (theme: Theme) =>
//     createStyles({

//     });

// interface IProps extends WithStyles<typeof styles> { }

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

                alert('you have successfully logged on');
                localStorage.setItem('username', this.state.username);
                localStorage.setItem('staff', 'true');
                this.loginSuccess();
                history.push('/staff');
            } else {
                this.setError(msg.statusText);
            }
        }).catch((status) => {
            console.log(status);
        });
    }

    loginSuccess() {
        //return (<Alert severity="success">This is a success message!</Alert>);
        this.setState({ isOpen: true });
        this.setState({ alertMessage: "You have successfully logged in" });
        this.setState({ severity: 'success' });
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
                    error={this.state.passerror}
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
