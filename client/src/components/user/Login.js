import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../api';

import './BackgroundVideo.css';

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
        <div class='video-background'>
          <div class='video-foreground'>
            <iframe
              src='https://www.youtube.com/embed/tGTvMVjX3Eo?start=7&autoplay=1&mute=1&controls=0&rel=0&loop=1&list=PLnV3b5c0KJlq_xTir5-P7LnFAQcuSnPaV'
              title='ConnectedPeer Promo'
              frameborder='0'></iframe>
          </div>
        </div>
        <div className='row section'>
          <div className='col s12 m6 offset-m3 xl4 offset-xl4'>
            <div className='card'>
              <div className='card-image'>
                <a href='https://connectedpeertutoring.org'>
                  <img src='/images/Connected.svg' alt='ConnectedPeer Logo' />
                </a>
              </div>
              <div className='card-content center-align'>
                <a href='http://localhost:3001/auth/google'>
                  <img
                    src={'/images/GoogleLogin.png'}
                    onMouseOver={(e) =>
                      (e.currentTarget.src = '/images/GoogleLoginHover.png')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = '/images/GoogleLogin.png')
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
