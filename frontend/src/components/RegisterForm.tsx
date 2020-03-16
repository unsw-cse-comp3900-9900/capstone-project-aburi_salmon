
import React, {useState} from 'react';
import './../pages/Login/LoginRegister.css';
import { TextField } from '@material-ui/core';
import history from './../history';

//tried https://github.com/benawad/react-typescript-material-ui-form/tree/1_form
//based off: https://github.com/creativesuraj/react-material-ui-login/blob/master/src/components/Login.tsx
//Need to learn hooks



export const RegisterForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [key, setKey] = useState('');

    const handleRegister = () => {
        if (key === "zootopia" && password === repassword) {
            history.push('/staff');
            alert('successfully registered');
        } else if (username === "" || password ==="" || repassword ==="" || key==="") {
            alert('all fields are required');
        } else if (key !== "zootopia"){
            alert('Key is wrong');
        } else if (password !== repassword){
            alert('Passwords inconsistent')
        }
    }


    return (
        <div className="signupbox">
            <h1><b>Register New Staff</b></h1>
            <form>
                <div>
                    Username:
                    <br></br>
                    <TextField
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        required
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
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <br></br>
                    Re-enter Password:
                            <br></br>
                    <TextField
                        id="repassword"
                        type="password"
                        required
                        onChange={(e) => setRepassword(e.target.value)}
                        placeholder="repassword"
                    />
                </div>
                <div>
                    <br></br>
                    Key:
                    <br></br>
                    <TextField
                        id="key"
                        required
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="key"
                    />
                </div>

                <br></br>
                    <button type="submit"
                        className=" loginbut "
                        onClick = {() => handleRegister()}
                        > Register </button>
            </form>
        </div>
    )
}

export default RegisterForm;
