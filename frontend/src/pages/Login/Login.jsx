import React from 'react';
import { TextField, withStyles } from '@material-ui/core';

import backbut from './../../assets/BackIcon.png';
import restlogo from './../../assets/Hojiak.png';
import { styles } from './styles';

// import './LoginRegister.css';

class PureLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleLogin() {
    if (this.state.username == null) {
      alert("Needs more than 0 character");
    } else {
      fetch("/auth/login", {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }),
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'keep-alive'
        }
      })
        .then((msg) => {
          console.log("1");
          console.log(msg);
          // history.push('/staff');
          alert(msg);
          console.log("2");
        })
        .catch((status) => {
          console.log(status);
          alert("Status");
        });
    }
  }

  render() {
    return (
      <div>
        <a href="/">
          <img src={backbut} alt="Back" className="back"></img>
        </a>

        <div className="loginbox">
          <img src={restlogo} className="logoimage" alt="logo" />
          <h1><b>Login</b></h1>
          <TextField
            id="username"
            onChange={(e) => this.setState({ username: e.target.value })}
            placeholder="username"
            required
            size="small"
          />
          <TextField
            id="password"
            type="password"
            placeholder="password"
            required
            size="small"
            onChange={(e) => this.setState({ password: e.target.value })}
          />

          <button
            onClick={() => this.handleLogin()}
          >
            Login
          </button>
        </div>

        <div className="vl "></div>
        {/* <RegisterForm /> */}
      </div>
    );
  }
}

export const Login = withStyles(styles)(PureLogin);
// export default PureLogin;
