import React, { Component } from 'react';
import M from 'materialize-css';
import moment from 'moment';
import api from '../../api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class CancelAppointment extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      openSuccess: false,
      openErr: false
    };
  }

  componentDidMount() {
    M.AutoInit();
  }

  async onSubmit(e) {
    e.preventDefault();

    await api.cancelAppointment(this.props.appointment).then((json) => {
      if (json.success) this.setState({ openSuccess: true });
      else this.setState({ openErr: true });
    });
    window.location.reload();
  }

  render() {
    return (
      <span
        onClick={(e) => this.setState({ openErr: false, openSuccess: false })}>
        <div id={'cancelAppointmentModal'} className='modal'>
          <div className='modal-content'>
            <h3 className='red-text'>
              Cancel Appointment with {this.props.user_data.firstName}
            </h3>
            <h4>
              {moment(this.props.appointment[0])
                .local()
                .format('h:mm A, dddd MMMM Do, YYYY')}
            </h4>
            <h5 className='red-text'>
              You may be penalized for cancelling an appointment
            </h5>
          </div>
          <div className='modal-footer'>
            <a
              href='#!'
              className='waves-effect waves-light btn red modal-close'
              onClick={this.onSubmit}>
              Cancel Appointment
              <i className='material-icons right'>delete_forever</i>
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
            Appointment could not be cancelled
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
            Appointment with {this.props.user_data.firstName} cancelled
          </MuiAlert>
        </Snackbar>
      </span>
    );
  }
}

export default CancelAppointment;
