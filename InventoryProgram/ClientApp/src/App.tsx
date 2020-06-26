import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import InvList from './components/InvList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/invlist/:startDateIndex?' component={InvList} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />
    </Layout>
);
