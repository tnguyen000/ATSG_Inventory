import React, { useState } from 'react';
import { connect } from 'react-redux';
import { actionCreators, InventoryItem, LoginBodyRequest, } from '../store/InventoryItems';
import { useDispatch, batch } from "react-redux";
import { push } from "connected-react-router";

//Signup page to create new user
const SignUp = () => {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [access, setAccessType] = useState<number>(0);
    const dispatch = useDispatch();
    const testBody = () => {
        let item = { username: userName, password: password, access: access } as LoginBodyRequest
        dispatch(actionCreators.postCreateUser(item))
        dispatch(push('/InvList'))
    }


    return (
        <React.Fragment><div>
        </div>
            <h1>Create New User Account</h1>
            <div>
                <h4>Enter Username:</h4>
                <input placeholder="Username" onChange={(event) => setUserName(event.target.value)}></input>
                <h4>Enter Password:</h4>
                <input placeholder="Password" onChange={(event) => setPassword(event.target.value)}></input>
                <h4>Enter Access Type:</h4>
                <input placeholder="Access Type" onChange={(event) => setAccessType(parseInt(event.target.value))}></input>
                <button onClick={testBody}>GO</button>
            </div>
            <div>
                <h6>For Access Type Enter:</h6>
                <p> "0" : For Sr. Managers / Managers</p>
                <p> "1" : For ATSG Engineers</p>
                <p> "0" : For Users</p>
            </div>
        </ React.Fragment>
    );
}
export default SignUp;