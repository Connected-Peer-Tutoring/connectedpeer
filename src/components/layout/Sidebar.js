import React, { Component } from 'react';
import M from 'materialize-css';
import { Avatar } from '@material-ui/core';

class Sidebar extends Component {
  async componentDidMount() {
    M.AutoInit();
  }

  render() {
    if (this.props.user_data.logged_in) {
      console.log(this.props.user_data);
      return (
        <div>
          <li>
            <div className='user-view'>
              <div className='background'>
                <img src='/cloudBackground.jpg' alt='user background' />
              </div>
              <a href={'/user/' + this.props.user_data._id}>
                <img
                  className='circle'
                  src={this.props.user_data.image}
                  alt='user pfp'
                />
              </a>
              <a href={'/user/' + this.props.user_data._id}>
                <span className='white-text name'>
                  {this.props.user_data.displayName}
                </span>
              </a>
              <a href={'/user/' + this.props.user_data._id}>
                <span className='white-text email'>
                  {this.props.user_data.email}
                </span>
              </a>
              <a href='/user/update'>
                <span className='white-text'>
                  <i className='fas fa-user-circle fa-small' /> Edit User Info
                </span>
              </a>
            </div>
          </li>
          <li>
            <a className='waves-effect' href='/'>
              Dashboard
            </a>
          </li>
          <li>
            <a className='waves-effect' href='/appointments'>
              Appointments
            </a>
          </li>
          <li>
            <div className='divider'></div>
          </li>
          <li>
            <a className='waves-effect waves-cyan' href='/learn'>
              Learn as a Student
            </a>
          </li>
          <li>
            <a className='waves-effect waves-green' href='/volunteer'>
              Volunteer as a Tutor
            </a>
          </li>
          <li>
            <div className='divider'></div>
          </li>
          <li>
            <a className='subheader' href='#!'>
              Contacts:
            </a>
          </li>
          {this.props.user_data.contacts.map((contact, i) => {
            return (
              <li key={i}>
                <a
                  className='waves-effect waves-green'
                  href={'/user/' + contact}>
                  <div className='row center'>
                    <div className='col s2'>
                      <Avatar
                        variant='square'
                        className='avatar-helper'
                        src={this.props.user_data.contacts_data[contact].image}
                        alt={
                          this.props.user_data.contacts_data[contact]
                            .firstName + "'s pfp"
                        }
                      />
                    </div>
                    <div className='col s10'>
                      {this.props.user_data.contacts_data[contact].displayName}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
          <li>
            <div className='divider'></div>
          </li>
          <li>
            <a className='subheader' href='https://connectedpeertutoring.org/'>
              © 2020 CPT
            </a>
          </li>
          <li>
            <a
              className='waves-effect'
              href='https://connectedpeertutoring.org/about'>
              About Us
            </a>
          </li>
          <li>
            <a
              className='waves-effect'
              href='https://connectedpeertutoring.org/report'>
              Report
            </a>
          </li>
          <li>
            <a
              className='waves-effect'
              href='https://connectedpeertutoring.org/privacy-policy'>
              Privacy Policy
            </a>
          </li>
          <li>
            <div className='divider'></div>
          </li>
          <li>
            <a
              className='waves-effect'
              href='http://localhost:3001/auth/logout'>
              Logout
            </a>
          </li>
        </div>
      );
    } else
      return (
        <div>
          <li>
            <a
              className='waves-effect'
              href='https://connectedpeertutoring.org'>
              About Us
            </a>
          </li>
          <li>
            <div className='divider'></div>
          </li>
          <li>
            <a
              className='waves-effect'
              href='http://localhost:3001/auth/google'>
              Login/Signup
            </a>
          </li>
        </div>
      );
  }
}

export default Sidebar;
