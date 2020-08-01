import React, { Component } from 'react';
import ShowAppointment from './ShowAppointment';
import CancelAppointment from './CancelAppointment';

class ShowAppointments extends Component {
  constructor(props) {
    super(props);

    this.updateChosenAppointment = this.updateChosenAppointment.bind(this);

    this.state = {
      appointment: [],
      user_data: {},
      tutor: null
    };
  }

  updateChosenAppointment(appointment, user_data) {
    this.setState({ appointment: appointment, user_data: user_data });
  }

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
    if (this.props.user_data.appointments.length > 0)
      return (
        <div>
          <h5>Future Appointments:</h5>
          {this.props.user_data.appointments.map((v, i) => {
            return (
              <ShowAppointment
                key={i}
                user_data={this.props.user_data}
                appointment={v}
                updateChosenAppointment={this.updateChosenAppointment}
              />
            );
          })}
          <CancelAppointment
            user_data={this.state.user_data}
            appointment={this.state.appointment}
            updateState={this.props.updateState}
          />
        </div>
      );
    else return <h5>You have no future appointments</h5>;
  }
}

export default ShowAppointments;
