const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  password: {
    type: String
  },
  members: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
