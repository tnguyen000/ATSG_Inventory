import React, { useState } from 'react';
import { connect } from 'react-redux';
import { actionCreators, WeatherForecast, LoginBodyRequest, } from '../store/WeatherForecasts';
import { useDispatch, batch } from "react-redux";
import { push } from "connected-react-router";

const SignUp = () => {
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch();
    const testBody = () => {
        let item = { username: userName, password: password } as LoginBodyRequest
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
                <button onClick={testBody}>GO</button>
            </div>

        </ React.Fragment>
    );
}
export default SignUp;