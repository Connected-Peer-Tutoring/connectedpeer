const mongoose = require('mongoose');

const TutorTimesSchema = new mongoose.Schema({
  time: {
    type: Number,
    required: true,
    index: true
  },
  tutors: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TutorTimes', TutorTimesSchema);
