import React, { Component } from 'react';
import Sidebar from './Sidebar';

class Navbar extends Component {
  render() {
    return (
      <nav className='primary-color-background'>
        <div className='nav-wrapper container'>
          <a href='/' className='brand-logo center'>
            ConnectedPeer
          </a>
          <a
            href='/'
            data-target='slide-out'
            className='sidenav-trigger show-on-large'>
            <i className='material-icons'>menu</i>
          </a>
          <ul className='sidenav' id='slide-out'>
            <Sidebar user_data={this.props.user_data} />
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
