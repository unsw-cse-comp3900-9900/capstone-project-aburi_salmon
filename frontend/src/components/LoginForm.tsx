
import React, {useState} from 'react';
import './../pages/Login/LoginRegister.css';
import restlogo from './../assets/Hojiak.png';
import { TextField} from '@material-ui/core';
import history from './../history';

import Popup from "reactjs-popup";


//Based off: https://github.com/creativesuraj/react-material-ui-login/blob/master/src/components/Login.tsx
//Tried but ...:https://github.com/benawad/react-typescript-material-ui-form/tree/1_form

// Personal todo list:

//modals: https://react-bootstrap.github.io/components/modal/


export const LoginForm = () => {  

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
   
    
    const handleLogin = async (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            });

            if (response.status !== 200) {
                setError(true);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        }



        // if (username ==="Yemi" && password ==="1234") {
        //     history.push('/staff');
        //     setError(true);
        //     alert('you are logged in');
        // } else if (username === "" || password === "") {
        //     alert('All fields are required');
        // } else {
        //     alert('Incorrect username/password');
            
        // }
    }

    return(
        <div className="loginbox">
            <img src={restlogo} className="logoimage" alt="logo" />
            <h1><b>Login</b></h1>
            <form>
                <div>
                Username:
                <br></br>
                    <TextField
                        id="username"
                        onChange={(e)=> setUsername(e.target.value)}
                        placeholder="username"
                        required
                        size="small"
                        error={error}
                    />
                </div>
                <div>

                <br></br>
                Password:
                <br></br>
                    <TextField
                        id="password"
                        type="password"
                        placeholder="password"
                        required
                        size="small"
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                </div>
                <br></br>
                <br></br>
             
                        <button
                            type="submit"
                            className=" loginbut "
                            onClick = {handleLogin}
                            > Login </button>
                   

            </form>
        </div>
    );
}

export default LoginForm;

// <pre>{JSON.stringify(values, null, 2)}</pre>
