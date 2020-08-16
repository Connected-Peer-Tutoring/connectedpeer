import React, { Component } from 'react';
import M from 'materialize-css';
import moment from 'moment';
import api from '../../api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class MakeAppointment extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSuccess: false,
      openErr: false,
      openErrWait: false,
      waiting: false
    };
  }

  componentDidMount() {
    M.AutoInit();
  }

  async onSubmit(e) {
    e.preventDefault();

    if (this.state.waiting) return this.setState({ openErrWait: true });

    // appointment array in order: [time, student id, tutor id, calendar event id, google meet id, jamboard id, attended boolean]
    const newAppointment = {
      appointment: [
        this.props.appointment_time,
        this.props.user_data._id,
        this.props.tutor_data._id,
        null,
        null,
        null,
        false
      ]
    };

    this.setState({ waiting: true });
    await api.makeAppointment(newAppointment).then((json) => {
      if (json.success)
        this.setState({
          openSuccess: true,
          openErrWait: false,
          waiting: false
        });
      else this.setState({ openErr: true, openErrWait: false, waiting: false });
    });
    this.props.updateState();
  }

  render() {
    if (!this.props.appointment_time) {
      return (
        <span
          onClick={(e) =>
            this.setState({ openErr: false, openSuccess: false })
          }>
          <div id={'makeAppointmentModal'} className='modal'>
            <div className='modal-content'>
              <h3 className='primary-color'>
                Make Appointment with {this.props.tutor_data.firstName}
              </h3>
              <h4>No time slot selected</h4>
            </div>
            <div className='modal-footer'>
              <a href='#!' className='waves-effect waves-light btn modal-close'>
                Take me back
                <i className='material-icons right'>arrow_back</i>
              </a>
            </div>
          </div>
          <Snackbar
            open={this.state.openErr}
            autoHideDuration={6000}
            onClose={this.handleClose}
            onClick={() => {
              this.setState({
                openErr: false
              });
            }}>
            <MuiAlert
              elevation={6}
              variant='filled'
              onClose={this.handleClose}
              severity='error'>
              Appointment could not be made
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={this.state.openSuccess}
            autoHideDuration={6000}
            onClose={this.handleClose}
            onClick={() => {
              this.setState({
                openSuccess: false
              });
            }}>
            <MuiAlert
              elevation={6}
              variant='filled'
              onClose={this.handleClose}
              severity='success'>
              Appointment with {this.props.tutor_data.firstName} made!
            </MuiAlert>
          </Snackbar>
        </span>
      );
    }
    return (
      <span
        onClick={(e) => this.setState({ openErr: false, openSuccess: false })}>
        <div id={'makeAppointmentModal'} className='modal'>
          <div className='modal-content'>
            <h3 className='primary-color'>
              Make Appointment with {this.props.tutor_data.firstName}
            </h3>
            <h4>
              {moment(this.props.appointment_time)
                .local()
                .format('h:mm A, dddd MMMM Do, YYYY')}
            </h4>
          </div>
          <div className='modal-footer'>
            <a
              href='#!'
              className='waves-effect waves-light btn modal-close'
              onClick={this.onSubmit}>
              Make Appointment!
              <i className='material-icons right'>send</i>
            </a>
          </div>
        </div>
        <Snackbar
          open={this.state.openErr}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErr: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Appointment could not be made
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrWait}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErrWait: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Please wait before requesting another appointment
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openSuccess}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openSuccess: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='success'>
            Appointment with {this.props.tutor_data.firstName} made!
          </MuiAlert>
        </Snackbar>
      </span>
    );
  }
}

export default MakeAppointment;
