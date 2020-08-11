const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// returns chat rooms
function getChats(req, res) {
  if (req.isAuthenticated()) {
    ChatRoom.find({ members: req.user._id.toString() }, (err, ChatRooms) => {
      res.json(ChatRooms);
    });
  }
}

// gets messages in chat room
async function getMessages(req, res) {
  let chatRoom = await ChatRoom.findById(req.params.roomId);
  if (
    req.isAuthenticated() &&
    chatRoom.members.indexOf(req.user._id.toString()) >= 0
  ) {
    Message.find({ chatRoom: req.params.roomId })
      .sort({ _id: -1 })
      .limit(100)
      .then((messages) => res.json(messages));
  }
}

module.exports = { getChats, getMessages };
