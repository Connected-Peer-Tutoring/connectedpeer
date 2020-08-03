const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  members: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
