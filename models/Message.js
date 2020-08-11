const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatRoom: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('Message', MessageSchema);
