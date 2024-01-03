const Room = require('../models/Room')
const Game = require('../models/Game')

const room_create = async (req, res) => {
    try {
        console.log('ROOM_CREATE')

        // before create room, create new game
        const newGame = new Game({
            gameInfo: [],
            gamePlayers: [],
            gameActive: false,
            gameTurn: '',
        })
        const newGameCreated = await newGame.save()
        const gameId = newGameCreated._id

        // create new room
        const roomName = req.body.roomName
        const newRoom = new Room({
            roomName,
            roomPlayers: [],
            roomGameId: gameId,
        })
        const newRoomCreated = await newRoom.save()
        if (!newRoomCreated) return res.status(200).json({ message: 'err' })
        const newRoomId = newRoomCreated._id

        res.json(newRoomId)
    } catch (err) {
        console.log(err)
    }
}

const room_read = async (req, res) => {
    try {
        console.log('ROOM_READ')
        const { roomId, userId } = req.params

        if (roomId?.length < 24) return
        const room = await Room.findById({ _id: roomId })

        res.json(room)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    room_create,
    room_read,
}
