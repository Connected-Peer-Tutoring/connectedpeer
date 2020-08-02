const express = require('express');
const router = express.Router();

const UserService = require('../UserService');
const TutorService = require('../TutorService');
const AppointmentService = require('../AppointmentService');

// returns logged_in boolean
router.get('/', async (req, res) => {
  try {
    res.json(req.isAuthenticated());
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// returns user data
router.get('/user', async (req, res) => {
  UserService.get(req, res);
});

// returns user past appointments data
router.get('/userPastAppointments', async (req, res) => {
  UserService.getPastAppointments(req, res);
});

// returns some users data
router.get('/user/:id', async (req, res) => {
  UserService.getWithID(req, res);
});

// updates user data
router.post('/updateUser', async (req, res) => {
  UserService.update(req, res);
});

// creates new tutor post
router.post('/tutorPost', async (req, res) => {
  TutorService.post(req, res);
});

// returns tutors query result
router.post('/getTutors', async (req, res) => {
  TutorService.getTutors(req, res);
});

// makes appointment
router.post('/makeAppointment', async (req, res) => {
  AppointmentService.make(req, res);
});

// cancels appointment
router.post('/cancelAppointment', async (req, res) => {
  AppointmentService.cancel(req, res);
});

module.exports = router;
