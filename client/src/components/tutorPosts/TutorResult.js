import React, { Component } from 'react';
import moment from 'moment';
import api from '../../api';
import MakeAppointment from '../appointments/MakeAppointment';

class TutorResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      subjects: [],
      tutorAvailability: [],
      chosenDate: null,
      user_data: {}
    };
  }

  async componentDidMount() {
    api.getUserWithId(this.props.tutor).then((json) => {
      this.setState({
        userId: this.props.tutor,
        user_data: json,
        subjects: json.subjects,
        tutorAvailability: json.tutorAvailability
      });
    });
  }

  render() {
    if (!this.state.user_data._id || !this.props.user_data._id) {
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
    if (this.state.user_data.user_dne) window.location.href = '/user';
    return (
      <div>
        <div className='card-panel grey lighten-5'>
          <div className='row'>
            <div className='col s3 xl1'>
              <a href={'/user/' + this.state.user_data._id}>
                <img
                  className='circle responsive-img'
                  alt={this.state.user_data.displayName + "'s pfp"}
                  src={this.state.user_data.image}
                />
              </a>
            </div>
            <div className='col s11'>
              <h6 className='primary-color'>
                {this.state.user_data.displayName}
              </h6>
              {this.state.user_data.grade > 0 ? (
                <div className='primary-color'>
                  <span className='black-text'>Grade: </span>
                  {
                    GradeList[
                      GradeList.findIndex((item) => {
                        return item.i === this.state.user_data.grade;
                      })
                    ].grade
                  }
                </div>
              ) : null}
              <div className='primary-color'>
                <span className='black-text'>Hours Volunteered: </span>
                {this.state.user_data.hours}
              </div>
              {this.state.subjects.map((v, i, ar) => {
                if (ar.length === 0) return null;
                else if (i === 0)
                  return (
                    <span>
                      Subjects {this.state.user_data.firstName} can tutor:{' '}
                      <a className='waves-effect waves-light' href={'#' + v}>
                        {v}
                      </a>
                    </span>
                  );
                else
                  return (
                    <span className='secondary-color'>
                      ,{' '}
                      <a className='waves-effect waves-light' href={'#' + v}>
                        {v}
                      </a>
                    </span>
                  );
              })}
              <div>
                {this.state.user_data.bio
                  ? 'About ' + this.state.user_data.firstName + ':'
                  : null}
                <div className='secondary-color'>
                  {this.state.user_data.bio}
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            {this.state.tutorAvailability
              .filter((v) => {
                return (
                  !(
                    v < this.props.time[0] ||
                    v > this.props.time[this.props.time.length - 1]
                  ) &&
                  !(
                    this.props.user_data.appointments.flat().indexOf(v) >= 0 ||
                    this.props.user_data.appointments
                      .flat()
                      .indexOf(v - 1800000) >= 0 ||
                    this.props.user_data.appointments
                      .flat()
                      .indexOf(v + 1800000) >= 0
                  )
                );
              })
              .map((v, i, ar) => {
                if (ar.length === 0 || this.state.subjects.length === 0)
                  return null;
                var t = moment(v).local();
                if (i === 0) {
                  return (
                    <span>
                      <div className='divider'></div>
                      <h6>Tutor Availability:</h6>
                      <h6 className='primary-color'>
                        {t.format('dddd MMMM Do, YYYY')}
                      </h6>
                      <span>
                        <a
                          className='waves-effect waves-cyan btn-flat btn-small modal-trigger'
                          href='#makeAppointmentModal'
                          onClick={() => this.setState({ chosenDate: v })}>
                          {t.format('h:mm A')}
                        </a>
                      </span>
                    </span>
                  );
                } else {
                  var t0 = moment(ar[i - 1]).local();
                  if (t.format('d') !== t0.format('d')) {
                    return (
                      <span>
                        <div className='divider'></div>
                        <h6 className='primary-color'>
                          {t.format('dddd MMMM Do, YYYY')}
                        </h6>
                        <span>
                          <a
                            className='waves-effect waves-cyan btn-flat btn-small modal-trigger'
                            href='#makeAppointmentModal'
                            onClick={() => this.setState({ chosenDate: v })}>
                            {t.format('h:mm A')}
                          </a>
                        </span>
                      </span>
                    );
                  } else
                    return (
                      <span>
                        <a
                          className='waves-effect waves-cyan btn-flat btn-small modal-trigger'
                          href='#makeAppointmentModal'
                          onClick={() => this.setState({ chosenDate: v })}>
                          {t.format('h:mm A')}
                        </a>
                      </span>
                    );
                }
              })}
            <MakeAppointment
              tutor_data={this.state.user_data}
              user_data={this.props.user_data}
              appointment_time={this.state.chosenDate}
              updateState={this.props.updateState}
            />
          </div>
        </div>
      </div>
    );
  }
}

const GradeList = [
  { grade: '7', i: 7 },
  { grade: '8', i: 8 },
  { grade: '9', i: 9 },
  { grade: '10', i: 10 },
  { grade: '11', i: 11 },
  { grade: '12', i: 12 },
  { grade: 'College and above', i: 13 }
];

export default TutorResult;
