import React, { Component } from 'react';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';

import { Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/' component={Home} />
      </Switch>
    );
  }
}

export default App;
