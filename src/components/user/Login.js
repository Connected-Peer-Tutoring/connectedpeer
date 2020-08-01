import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../api';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      logged_in: false
    };
  }

  async componentDidMount() {
    api.getLoggedIn().then((json) => this.setState({ logged_in: json }));
  }

  render() {
    if (this.state.logged_in) return <Redirect to={{ pathname: '/' }} />;
    return (
      <div>
        <nav className='primary-color-background'>
          <div className='nav-wrapper container'>
            <a href='/' className='brand-logo center'>
              ConnectedPeer
            </a>
          </div>
        </nav>
        <div className='row section'>
          <div className='col s12 m6 offset-m3 xl4 offset-xl4'>
            <div className='card'>
              <div className='card-image'>
                <a href='https://connectedpeertutoring.org'>
                  <img src='/Connected.svg' alt='ConnectedPeer Logo' />
                </a>
              </div>
              <div className='card-content center-align'>
                <a href='http://localhost:3001/auth/google'>
                  <img
                    src={'/GoogleLogin.png'}
                    onMouseOver={(e) =>
                      (e.currentTarget.src = '/GoogleLoginHover.png')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = '/GoogleLogin.png')
                    }
                    alt='Google Login'
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
