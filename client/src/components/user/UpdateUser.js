import React, { Component } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import api from '../../api';
import ChangePFP from './ChangePFP';

class UpdateUser extends Component {
  constructor(props) {
    super(props);

    this.onChangeDisplayName = this.onChangeDisplayName.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeTutorAvailability = this.onChangeTutorAvailability.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      _id: null,
      email: null,
      subjects: [],
      tutorAvailability: [],
      displayName: null,
      grade: 0,
      firstName: null,
      lastName: null,
      bio: null,
      openSuccess: false,
      openErr: false
    };
  }

  async componentDidMount() {
    api.getUser().then((json) => {
      this.setState({
        _id: json._id,
        email: json.email,
        subjects: json.subjects,
        tutorAvailability: json.tutorAvailability,
        displayName: json.displayName,
        grade: json.grade,
        firstName: json.firstName,
        lastName: json.lastName,
        bio: json.bio
      });
    });
  }

  onChangeDisplayName(e) {
    this.setState({
      displayName: e.target.value,
      openSuccess: false,
      openErr: false
    });
  }

  onChangeFirstName(e) {
    this.setState({
      firstName: e.target.value,
      openSuccess: false,
      openErr: false
    });
  }

  onChangeLastName(e) {
    this.setState({
      lastName: e.target.value,
      openSuccess: false,
      openErr: false
    });
  }

  onChangeGrade(e, v) {
    this.setState({
      grade: v.i,
      openSuccess: false,
      openErr: false
    });
  }

  onChangeBio(e) {
    this.setState({
      bio: e.target.value,
      openSuccess: false,
      openErr: false
    });
  }

  onChangeSubject(e) {
    this.setState({
      subjects: this.state.subjects.filter((subject) => {
        return e.target.toString().replace(/%20/g, ' ').indexOf(subject) < 0;
      })
    });
  }

  onChangeTutorAvailability(e) {
    this.setState({
      tutorAvailability: this.state.tutorAvailability.filter((t) => {
        return e.target.toString().indexOf(t.toString()) < 0;
      })
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    const updatedUser = {
      displayName: this.state.displayName,
      grade: this.state.grade,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      bio: this.state.bio,
      subjects: this.state.subjects,
      tutorAvailability: this.state.tutorAvailability
    };

    if (this.state.grade === 0 && this.props.user_data.grade === 0) {
      this.setState({
        openErr: true
      });
    } else if (this.props.user_data.grade === 0) {
      await api.postUserUpdate(updatedUser);
      this.setState({
        openSuccess: true
      });
      window.location.href = '/';
    } else {
      api.postUserUpdate(updatedUser);
      this.setState({
        openSuccess: true
      });
    }
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({
      openSuccess: false,
      openErr: false
    });
  }

  render() {
    if (!this.state._id) {
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
        <ChangePFP
          user_data={this.props.user_data}
          updateState={this.props.updateState}
        />
        <div className='row'>
          <div className='col s12 xl6 offset-xl3'>
            <div className='card-panel grey lighten-5'>
              <div className='row'>
                <div className='col s3 xl1'>
                  <a className='modal-trigger' href='#changePFPModal'>
                    <img
                      className='circle responsive-img'
                      alt={this.state.displayName + "'s pfp"}
                      src={this.props.user_data.image}
                    />
                  </a>
                </div>
                <div className='col s11'>
                  <h6 className='primary-color'>{this.state.displayName}</h6>
                  {this.state.grade > 0 ? (
                    <div className='primary-color'>
                      <span className='black-text'>Grade: </span>
                      {
                        GradeList[
                          GradeList.findIndex((item) => {
                            return item.i === this.state.grade;
                          })
                        ].grade
                      }
                    </div>
                  ) : null}
                  <div className='primary-color'>
                    <span className='black-text'>Hours Volunteered: </span>
                    {this.props.user_data.hours}
                  </div>
                  {this.state.subjects.map((v, i, ar) => {
                    if (ar.length === 0) return null;
                    else if (i === 0)
                      return (
                        <span key={i}>
                          Subjects {this.state.firstName} can tutor:{' '}
                          <a
                            className='waves-effect waves-light'
                            href={'#' + v}
                            onClick={this.onChangeSubject}>
                            {v + ' ×'}
                          </a>
                        </span>
                      );
                    else
                      return (
                        <span className='secondary-color' key={i}>
                          ,{' '}
                          <a
                            className='waves-effect waves-light'
                            href={'#' + v}
                            onClick={this.onChangeSubject}>
                            {v + ' ×'}
                          </a>
                        </span>
                      );
                  })}
                  <div>
                    {this.state.bio
                      ? 'About ' + this.state.firstName + ':'
                      : null}
                    <div className='secondary-color'>{this.state.bio}</div>
                  </div>
                </div>
              </div>
              <div className='row'>
                {this.state.tutorAvailability.map((v, i, ar) => {
                  if (ar.length === 0) return null;
                  var t = moment(v).local();
                  if (i === 0) {
                    return (
                      <span key={i}>
                        <div className='divider'></div>
                        <h6>Tutor Availability:</h6>
                        <h6 className='primary-color'>
                          {t.format('dddd MMMM Do, YYYY')}
                        </h6>
                        <span>
                          <a
                            className='waves-effect waves-cyan btn-flat btn-small'
                            href={'#' + v}
                            onClick={this.onChangeTutorAvailability}>
                            {t.format('h:mm A ') + '×'}
                          </a>
                        </span>
                      </span>
                    );
                  } else {
                    var t0 = moment(ar[i - 1]).local();
                    if (t.format('d') !== t0.format('d')) {
                      return (
                        <span key={i}>
                          <div className='divider'></div>
                          <h6 className='primary-color'>
                            {t.format('dddd MMMM Do, YYYY')}
                          </h6>
                          <span>
                            <a
                              className='waves-effect waves-cyan btn-flat btn-small'
                              href={'#' + v}
                              onClick={this.onChangeTutorAvailability}>
                              {t.format('h:mm A ') + '×'}
                            </a>
                          </span>
                        </span>
                      );
                    } else
                      return (
                        <span key={i}>
                          <a
                            className='waves-effect waves-cyan btn-flat btn-small'
                            href={'#' + v}
                            onClick={this.onChangeTutorAvailability}>
                            {t.format('h:mm A ') + '×'}
                          </a>
                        </span>
                      );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 xl6 offset-xl3'>
            <div className='row'>
              <form
                className='col s12'
                onSubmit={this.onSubmit}
                id='User_Update_Form'>
                <div className='row'>
                  <div className='input-field col s12'>
                    <TextField
                      id='name'
                      fullWidth
                      onChange={this.onChangeDisplayName}
                      label='Display Name'
                      defaultValue={this.state.displayName}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col s6'>
                    <TextField
                      id='first_name'
                      fullWidth
                      onChange={this.onChangeFirstName}
                      label='First name'
                      defaultValue={this.state.firstName}
                    />
                  </div>
                  <div className='input-field col s6'>
                    <TextField
                      id='last_name'
                      fullWidth
                      onChange={this.onChangeLastName}
                      label='Last name'
                      defaultValue={this.state.lastName}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col s12'>
                    <TextField
                      disabled
                      id='email'
                      fullWidth
                      type='email'
                      defaultValue={this.state.email}
                      label='Email'
                      className='validate'
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col s12'>
                    <Autocomplete
                      id='grade-level'
                      options={GradeList}
                      getOptionLabel={(option) => option.grade}
                      defaultValue={
                        this.state.grade > 0
                          ? GradeList[
                              GradeList.findIndex((item) => {
                                return item.i === this.state.grade;
                              })
                            ]
                          : null
                      }
                      onChange={this.onChangeGrade}
                      renderInput={(params) => (
                        <TextField {...params} label='Grade' />
                      )}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col s12'>
                    <TextField
                      margin='normal'
                      id='standard-multiline-static'
                      multiline
                      fullWidth
                      placeholder="Your Bio: (ex: I'm a junior in University High School.)"
                      label='Bio:'
                      defaultValue={this.state.bio}
                      helperText='Provide information about you for your peers'
                      onChange={this.onChangeBio}
                    />
                  </div>
                </div>
                <input
                  type='submit'
                  value='Update'
                  className='waves-effect waves-light btn tertiary-color-background'
                />
              </form>
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
              Please input your grade
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
              Your user info has been successfully changed
            </MuiAlert>
          </Snackbar>
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

export default UpdateUser;
