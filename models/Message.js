const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId
  },
  type: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
