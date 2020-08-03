const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// returns chat rooms
function getChats(req, res) {
  ChatRoom.find({ members: req.user._id.toString() }, (err, ChatRooms) => {
    console.log(ChatRooms);
  });
}

// gets messages in chat room
function getMessages(req, res) {
  Message.find({ chatRoom: req.params.roomId }, (err, messages) => {
    res.json(messages);
  });
}

module.exports = { getChats, getMessages };
