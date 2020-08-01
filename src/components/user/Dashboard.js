import React, { Component } from 'react';
import ShowAppointments from '../appointments/ShowAppointments';

class Dashboard extends Component {
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
    if (this.props.user_data.grade === 0) window.location.href = '/tutorial';
    var goal = Math.ceil(
      0.25 *
        10 ** Math.ceil(Math.log10(this.props.user_data.hours + 1)) *
        Math.ceil(
          (this.props.user_data.hours + 1) /
            (0.25 * 10 ** Math.ceil(Math.log10(this.props.user_data.hours + 1)))
        )
    );
    return (
      <div>
        <div className='row'>
          <div className='col s12 xl8 offset-xl2'>
            <h4 className='primary-color'>
              Welcome {this.props.user_data.displayName}
            </h4>
            <div>
              You have volunteered for: {this.props.user_data.hours} hours
            </div>
            <div>Current Goal: {goal} hours</div>
            <div className='progress'>
              <div
                className='determinate teal'
                style={{
                  width: (this.props.user_data.hours / goal) * 100 + '%'
                }}></div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 xl4 offset-xl2'>
            <ShowAppointments
              user_data={this.props.user_data}
              updateState={this.props.updateState}
            />
          </div>
          <div className='col s12 xl4'>
            <h5>Get started:</h5>
            <div className='card-panel flex-container'>
              <h5 className='cyan-text space-between'>
                Learn as a peer student
                <a
                  className='waves-effect waves-light btn-large cyan'
                  href='/learn'>
                  <i className='material-icons'>trending_up</i>
                </a>
              </h5>
            </div>
            <div className='card-panel flex-container'>
              <h5 className='teal-text space-between'>
                Volunteer as a peer tutor
                <a
                  className='waves-effect waves-light btn-large teal'
                  href='/volunteer'>
                  <i className='material-icons'>trending_up</i>
                </a>
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
