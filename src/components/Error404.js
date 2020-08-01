import React, { Component } from 'react';

class Error404 extends Component {
  render() {
    return (
      <div>
        <div className='row section'>
          <div className='col s12 xl4 offset-xl4'>
            <div className='card'>
              <div className='card-image'>
                <a href='https://connectedpeertutoring.org'>
                  <img
                    src='../../images/Connected.svg'
                    alt='ConnectedPeer Logo'
                  />
                </a>
              </div>
              <div className='card-content center-align'>
                <p>
                  Error 404: You've arrived at a page that does not exist :(
                </p>
                <a
                  className='waves-effect waves-light btn back tertiary-color-background'
                  href='/'>
                  Click here to go back to a page that exists
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Error404;
