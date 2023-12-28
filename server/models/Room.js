const mongoose = require('mongoose')
const roomSchema = mongoose.Schema(
    {
        roomName: String,
        roomPlayers: [],
        roomGameId: String,
    },
    { timestamps: true }
)

const room = mongoose.model('Room', roomSchema)
module.exports = room
