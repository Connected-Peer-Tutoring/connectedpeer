import React, { Component } from 'react';

class Tutorial extends Component {
  render() {
    if (!this.props.user_data._id) {
      return (
        <div className='center'>
          <div className='preloader-wrapper big active'>
            <div className='spinner-layer spinner-blue-only'>
              <div className='circle-clipper left'>
                <div className='circle'></div>
              </div>
              <div className='gap-patch'>
                <div className='circle'></div>
              </div>
              <div className='circle-clipper right'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className='row'>
          <div className='col s12 xl6 offset-xl3'>
            <div className='card-panel grey lighten-5'>
              <div className='tutorial-container'>
                <iframe
                  className='tutorial-video'
                  title='tutorial video'
                  src='https://www.youtube.com/embed/0sXyGG8-W7A'
                  frameborder='0'
                  allow='autoplay; encrypted-media'
                  allowfullscreen='allowfullscreen'
                  mozallowfullscreen='mozallowfullscreen'
                  msallowfullscreen='msallowfullscreen'
                  oallowfullscreen='oallowfullscreen'
                  webkitallowfullscreen='webkitallowfullscreen'></iframe>
              </div>
              <div className='row'>
                <div className='right'>
                  <a
                    href='/user/update'
                    className='waves-effect waves-light btn'
                    style={{ margin: '0.7em' }}>
                    Continue
                    <i className='material-icons right'>arrow_forward</i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tutorial;
