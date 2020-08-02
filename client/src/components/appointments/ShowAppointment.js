import React, { Component } from 'react';
import moment from 'moment';

class ShowAppointment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      tutor: null
    };
  }

  async componentDidMount() {
    if (
      (await this.props.appointment[1]) === (await this.props.user_data._id)
    ) {
      this.setState({ userId: this.props.appointment[2], tutor: false });
    } else {
      this.setState({ userId: this.props.appointment[1], tutor: true });
    }
  }

  render() {
    if (!this.state.userId || !this.props.user_data.contacts_data) {
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
      <div className={this.state.tutor ? 'card-panel teal' : 'card-panel cyan'}>
        <div className='row'>
          <div className='col s12 xl6'>
            <a href={'/user/' + this.state.userId}>
              <h5 className='white-text'>
                <strong>
                  Appointment with{' '}
                  {
                    this.props.user_data.contacts_data[this.state.userId]
                      .displayName
                  }
                </strong>
              </h5>
            </a>
            <h6 className='white-text'>
              {moment(this.props.appointment[0])
                .local()
                .format('h:mm A, dddd MMMM Do, YYYY')}
            </h6>
          </div>
          <div className='col s12 xl6'>
            <a
              className='waves-effect white-text'
              href={'/user/' + this.state.userId}>
              <h5 className='white-text'>
                Tutor:{' '}
                {this.state.tutor
                  ? this.props.user_data.displayName
                  : this.props.user_data.contacts_data[this.state.userId]
                      .displayName}
              </h5>
            </a>
          </div>
          <div className='col'>
            <div className='divider' />
            <a
              className={
                this.state.tutor
                  ? 'waves-effect btn white teal-text'
                  : 'waves-effect btn white cyan-text'
              }
              style={{ margin: '0.5em' }}
              href={
                '/chat/' +
                this.props.user_data.contacts_data[this.state.userId].chatRoom
              }>
              Chat<i className='material-icons right'>chat</i>
            </a>{' '}
            <a
              className={
                this.state.tutor
                  ? 'waves-effect btn white teal-text'
                  : 'waves-effect btn white cyan-text'
              }
              style={{ margin: '0.5em' }}
              target='_blank'
              rel='noopener noreferrer'
              href={this.props.appointment[4]}>
              Join Google Meet<i className='material-icons right'>videocam</i>
            </a>{' '}
            <a
              className={
                this.state.tutor
                  ? 'waves-effect btn white teal-text'
                  : 'waves-effect btn white cyan-text'
              }
              style={{ margin: '0.5em' }}
              target='_blank'
              rel='noopener noreferrer'
              href={
                'https://jamboard.google.com/d/' + this.props.appointment[5]
              }>
              Open Jamboard<i className='material-icons right'>create</i>
            </a>{' '}
            <a
              className={
                this.state.tutor
                  ? 'waves-effect btn teal white-text modal-trigger'
                  : 'waves-effect btn cyan white-text modal-trigger'
              }
              style={{ margin: '0.5em' }}
              href='#cancelAppointmentModal'
              onClick={() =>
                this.props.updateChosenAppointment(
                  this.props.appointment,
                  this.props.user_data.contacts_data[this.state.userId]
                )
              }>
              Cancel <i className='material-icons right'>delete_forever</i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowAppointment;
