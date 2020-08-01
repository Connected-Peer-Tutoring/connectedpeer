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
import TutorSearchHelper from './TutorSearchHelper';

class TutorSearch extends Component {
  constructor(props) {
    super(props);

    this.onChangeAvailableStart = this.onChangeAvailableStart.bind(this);
    this.onChangeAvailableEnd = this.onChangeAvailableEnd.bind(this);
    this.onChangeSubjects = this.onChangeSubjects.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      availableStart: moment().startOf('hour').add(48, 'h'),
      availableEnd: moment().startOf('hour').add(49, 'h'),
      subjects: [],
      query: {
        time: [null],
        subjects: [null]
      },
      openErrTime: false,
      openErrTime1: false,
      openErrSubjects: false,
      tutors: []
    };
  }

  onChangeAvailableStart(e) {
    this.setState({
      availableStart: e,
      openErrTime: false,
      openErrTime1: false,
      openErrSubjects: false
    });
  }

  onChangeAvailableEnd(e) {
    this.setState({
      availableEnd: e,
      openErrTime: false,
      openErrTime1: false,
      openErrSubjects: false
    });
  }

  onChangeSubjects(e, v) {
    if (v.length > 5)
      this.setState({
        subjects: v,
        openErrTime: false,
        openErrTime1: false,
        openErrSubjects: true
      });
    else
      this.setState({
        subjects: v,
        openErrTime: false,
        openErrTime1: false,
        openErrSubjects: false
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

    if (aStart + 1800000 > aEnd) {
      this.setState({
        openErrTime: true
      });
    } else if (aStart - 86400000 < new Date().valueOf()) {
      this.setState({
        openErrTime1: true
      });
    } else if (this.state.subjects.length > 5) {
      this.setState({
        openErrSubjects: true
      });
    } else {
      var time = [];
      for (
        var i = Math.ceil(aStart / 1800000);
        i < Math.floor(aEnd / 1800000);
        i++
      ) {
        time.push(i * 1800000);
      }
      this.setState({
        tutors: [],
        query: {
          time: time,
          subjects: this.state.subjects
        }
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
              id='Find_Tutor_Form'>
              <div className='row'>
                <div className='input-field col s12'>
                  <Grid container justify='space-between'>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <KeyboardDatePicker
                        variant='inline'
                        margin='normal'
                        id='search_date'
                        label='Date'
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
                        id='time_start'
                        label='Time range start'
                        value={this.state.availableStart}
                        onChange={this.onChangeAvailableStart}
                        KeyboardButtonProps={{
                          'aria-label': 'change time'
                        }}
                      />
                      <KeyboardTimePicker
                        variant='inline'
                        margin='normal'
                        id='time_end'
                        label='Time range end'
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
                    options={SubjectList.filter(
                      (v) => this.props.user_data.subjects.indexOf(v) < 0
                    )}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    onChange={this.onChangeSubjects}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Subjects'
                        helperText='Filter tutors by subjects'
                      />
                    )}
                  />
                </div>
              </div>
              <input
                type='submit'
                value='Find tutors'
                className='waves-effect waves-light btn cyan'
              />
            </form>
          </div>
          <TutorSearchHelper
            query={this.state.query}
            user_data={this.props.user_data}
            updateState={this.props.updateState}
          />
        </div>
        <Snackbar
          open={this.state.openErrTime}
          autoHideDuration={6000}
          onClose={this.handleClose}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Your search time range must be atleast 30 minutes
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrTime1}
          autoHideDuration={6000}
          onClose={this.handleClose}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Your search time must be atleast 24 hours ahead
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrSubjects}
          autoHideDuration={6000}
          onClose={this.handleClose}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Your subject filter must be no larger than 5 subjects
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

export default TutorSearch;
