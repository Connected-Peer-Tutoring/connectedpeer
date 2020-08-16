import React, { Component } from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import api from '../../api';

class PostTutor extends Component {
  constructor(props) {
    super(props);

    this.onChangeAvailableStart = this.onChangeAvailableStart.bind(this);
    this.onChangeAvailableEnd = this.onChangeAvailableEnd.bind(this);
    this.onChangeSubjects = this.onChangeSubjects.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      availableStart: moment().startOf('hour').add(24, 'h'),
      availableEnd: moment().startOf('hour').add(25, 'h'),
      subjects: [],
      bio: '',
      openSuccess: false,
      openErrTime: false,
      openErrTime1: false,
      openErrSubject: false,
      openErrBio: false
    };
  }

  onChangeAvailableStart(e) {
    this.setState({
      availableStart: e,
      openSuccess: false,
      openErrTime: false,
      openErrSubject: false,
      openErrBio: false
    });
  }

  onChangeAvailableEnd(e) {
    this.setState({
      availableEnd: e,
      openSuccess: false,
      openErrTime: false,
      openErrSubject: false,
      openErrBio: false
    });
  }

  onChangeSubjects(e, v) {
    this.setState({
      subjects: v,
      openSuccess: false,
      openErrTime: false,
      openErrSubject: false,
      openErrBio: false
    });
  }

  onChangeBio(e) {
    this.setState({
      bio: e.target.value,
      openSuccess: false,
      openErrTime: false,
      openErrSubject: false,
      openErrBio: false
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    var aStart = this.state.availableStart.clone();
    var aEnd = this.state.availableEnd.clone();
    aEnd = aStart
      .clone()
      .startOf('day')
      .hour(aEnd.hour())
      .minute(aEnd.minute())
      .utc()
      .valueOf();
    aStart = aStart.utc().valueOf();

    if (aEnd < aStart && aEnd - aStart <= 43200000) {
      aEnd = aEnd + 86400000;
    }

    if (aStart + 3600000 > aEnd) {
      this.setState({
        openErrTime: true
      });
    } else if (aEnd - aStart > 28800000) {
      this.setState({
        openErrTime1: true
      });
    } else if (
      this.state.subjects.length === 0 &&
      this.props.user_data.subjects.length === 0
    ) {
      this.setState({
        openErrSubject: true
      });
    } else if (
      this.state.bio.length === 0 &&
      this.props.user_data.bio.length === 0
    ) {
      this.setState({
        openErrBio: true
      });
    } else {
      var tutorAvailability = this.props.user_data.tutorAvailability;
      for (
        var i = Math.ceil(aStart / 1800000);
        i < Math.floor(aEnd / 1800000);
        i++
      ) {
        if (tutorAvailability.indexOf(i * 1800000) < 0)
          tutorAvailability.push(i * 1800000);
      }
      const newTutorPost = {
        subjects:
          this.state.subjects.length === 0
            ? this.props.user_data.subjects
            : this.state.subjects,
        bio: !this.state.bio ? this.props.user_data.bio : this.state.bio,
        tutorAvailability: tutorAvailability
      };
      api.postTutorPost(newTutorPost);
      this.setState({
        openSuccess: true
      });
    }
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
    return (
      <div className='row'>
        <div className='col s12 xl6 offset-xl3'>
          <div className='row'>
            <form
              className='col s12'
              onSubmit={this.onSubmit}
              id='Post_Tutor_Form'>
              <div className='row'>
                <div className='input-field col s12'>
                  <Grid container justify='space-between'>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        variant='inline'
                        margin='normal'
                        id='date_available'
                        label='Date available'
                        format='M/D/YYYY'
                        value={this.state.availableStart}
                        onChange={this.onChangeAvailableStart}
                        KeyboardButtonProps={{
                          'aria-label': 'change date'
                        }}
                      />
                      <KeyboardTimePicker
                        variant='inline'
                        margin='normal'
                        id='time_available_start'
                        label='Available time range start'
                        value={this.state.availableStart}
                        onChange={this.onChangeAvailableStart}
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                      />
                      <KeyboardTimePicker
                        variant='inline'
                        margin='normal'
                        id='time_available_end'
                        label='Available time range end'
                        value={this.state.availableEnd}
                        onChange={this.onChangeAvailableEnd}
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </div>
              </div>
              <div className='row'>
                <div className='input-field col s12'>
                  <Autocomplete
                    multiple
                    id='subjects'
                    size='small'
                    options={SubjectList}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    defaultValue={this.props.user_data.subjects}
                    onChange={this.onChangeSubjects}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Subjects'
                        helperText='List the subjects you can be a tutor in'
                      />
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
                    placeholder="Ex: I'm a junior in University High School. I have been a peer tutor for 3 months. I have recieved a 5 on AP Biology and AP Calculus AB and can tutor in those subjects."
                    label='Bio:'
                    defaultValue={this.props.user_data.bio}
                    helperText='Provide information about you for the peer students'
                    onChange={this.onChangeBio}
                  />
                </div>
              </div>
              <input
                type='submit'
                value='Post'
                className='waves-effect waves-light btn teal'
              />
            </form>
          </div>
        </div>
        <Snackbar
          open={this.state.openErrTime}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErrTime: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Your availabilty must be atleast an hour
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrTime1}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErrTime1: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            You can only post up to 8 hours
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrSubject}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErrSubject: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Please input the subject(s) you can tutor
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrBio}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({
              openErrBio: false
            });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Please input more information on your bio
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
            Your tutor availabilty has been succesfully posted
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

const SubjectList = [
  'Math',
  'Algebra',
  'Algebra 2',
  'Geometry',
  'Precalculus',
  'AP Statistics',
  'Calculus',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Economics Micro',
  'AP Economics Macro',
  'Biology',
  'AP Biology',
  'AP Enviromental Science',
  'Chemistry',
  'AP Chemistry',
  'Physics',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C',
  'English',
  'AP English Lang',
  'AP English Lit',
  'AP Psychology',
  'History',
  'AP Human Geography',
  'AP US History',
  'AP European History',
  'AP World History',
  'Spanish',
  'AP Spanish',
  'Chinese',
  'AP Chinese',
  'French',
  'AP French',
  'AP Computer Science P',
  'AP Computer Science A'
];

export default PostTutor;
