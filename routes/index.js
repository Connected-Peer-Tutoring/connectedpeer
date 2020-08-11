const express = require('express');
const router = express.Router();
const multer = require('multer');

const UserService = require('../UserService');
const TutorService = require('../TutorService');
const AppointmentService = require('../AppointmentService');
const ChatService = require('../ChatService');
const FileUploadService = require('../FileUploadService');

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

// returns chat rooms
router.get('/chat', async (req, res) => {
  ChatService.getChats(req, res);
});

// gets messages in chat room
router.get('/chat/:roomId', async (req, res) => {
  ChatService.getMessages(req, res);
});

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Upload pfp picture
router.post('/profile-img-upload', upload.single('file'), async (req, res) => {
  FileUploadService.postProfileImage(req, res);
});

// upload file for chat
router.post('/file-upload', upload.single('file'), async (req, res) => {
  FileUploadService.postFile(req, res);
});

module.exports = router;
