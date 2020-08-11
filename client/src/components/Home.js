import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

import '../App.css';

import api from '../api';

import Navbar from './layout/Navbar';
import Dashboard from './user/Dashboard';
import PostTutor from './tutorPosts/PostTutor';
import UserInfoWithRouter from './user/UserInfo';
import ShowAppointments from './appointments/ShowAppointments';
import TutorSearch from './tutorPosts/TutorSearch';
import Tutorial from './user/Tutorial';
import ChatWithRouter from './chat/Chat';

class Home extends Component {
  constructor() {
    super();

    this.updateState = this.updateState.bind(this);

    this.state = {
      logged_in: true,
      user_data: {}
    };
  }

  async componentDidMount() {
    api
      .getUser()
      .then((json) =>
        this.setState({ user_data: json, logged_in: json.logged_in })
      );
  }

  updateState() {
    api.getUser().then((json) => this.setState({ user_data: json }));
  }

  render() {
    if (!this.state.logged_in) return <Redirect to={{ pathname: '/login' }} />;
    if (this.state.user_data.grade === -1)
      return <Redirect to={{ pathname: '/api/logout' }} />;
    return (
      <div>
        <Navbar user_data={this.state.user_data} />
        <Route
          exact
          path='/'
          render={() => (
            <Dashboard
              user_data={this.state.user_data}
              updateState={this.updateState}
            />
          )}
        />
        <Route
          path='/tutorial'
          render={() => <Tutorial user_data={this.state.user_data} />}
        />
        <Route
          path='/user/:userId'
          render={() => (
            <UserInfoWithRouter
              user_data={this.state.user_data}
              updateState={this.updateState}
            />
          )}
        />
        <Route
          path='/chat/:roomId'
          render={() => (
            <ChatWithRouter
              user_data={this.state.user_data}
              updateState={this.updateState}
            />
          )}
        />
        <Route
          path='/learn'
          render={() => (
            <TutorSearch
              user_data={this.state.user_data}
              updateState={this.updateState}
            />
          )}
        />
        <Route
          path='/volunteer'
          render={() => <PostTutor user_data={this.state.user_data} />}
        />
        <Route
          path='/appointments'
          render={() => (
            <div className='row'>
              <div className='col s12 xl8 offset-xl2'>
                <ShowAppointments
                  user_data={this.state.user_data}
                  updateState={this.updateState}
                />
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default Home;
