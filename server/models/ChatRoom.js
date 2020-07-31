const mongoose = require('mongoose')

const ChatRoomSchema = new mongoose.Schema({
    members: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('ChatRoom', ChatRoomSchema)