import React, { useState } from 'react';
import { connect } from 'react-redux';
import { actionCreators, InventoryItem, LoginBodyRequest } from '../store/InventoryItems';
import { useDispatch, batch } from "react-redux";
import { push } from "connected-react-router";

//Login page
const Login = () => {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const testBody = () => {
        let item = { username: userName, password: password } as LoginBodyRequest
        dispatch(actionCreators.postLoginUser(item))
    }
    const testBodyTwo = () => {
        dispatch(push('/SignUp'))
    }


    return (
        <React.Fragment><div>
        </div>
            <h1>Log in to System Monitor</h1>
            <div>
                <h4>Enter Username:</h4>
                <input placeholder="Username" onChange={(event) => setUserName(event.target.value)}></input>
                <h4>Enter Password:</h4>
                <input placeholder="Password" onChange={(event) => setPassword(event.target.value)}></input>
                <button onClick={testBody}>GO</button>
            </div>
            <div>
                <button onClick={testBodyTwo}>Create New User</button>
            </div>
        </ React.Fragment>
    );
}
export default Login;