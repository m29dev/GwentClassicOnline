const Room = require('../models/Room')
const Game = require('../models/Game')

const handleRoomJoin = async (socket, room_id) => {
    if (room_id?.length < 24) return
    const room = await Room.findById({ _id: room_id })
    if (!room)
        return (
            console.log('no room found'),
            socket.emit('roomJoinData', {
                error: 'no room found',
            })
        )

    // check if user nickname is already in tha clients array
    let isClient = false
    room?.roomPlayers?.forEach((player) => {
        if (player === socket.userId) {
            return (isClient = true)
        }
    })

    if (isClient) {
        // join socket client to the room
        socket.join(room_id)

        socket.emit('roomJoinData', {
            room,
            message: `${socket.userId}'s rejoined the room`,
        })

        console.log(`${socket.userId} ${socket.id}'s rejoined Room ${room_id}`)

        return
    }

    // check if can join (1 or less players in the room)
    if (room.roomPlayers.length >= 2) {
        return console.log('2/2 players in the room. Cannot join.')
    }

    // add user nickname to the database clients array
    if (!isClient) {
        // join socket client to the room
        socket.join(room_id)

        room.roomPlayers.push(socket.userId)
        await Room.findByIdAndUpdate(
            { _id: room._id },
            { roomPlayers: room.roomPlayers }
        )

        socket.emit('roomJoinData', {
            room,
            message: `${socket.userId}'s joined the room`,
        })

        console.log(`${socket.userId} ${socket.id}'s joined Room ${room_id}`)
    }
}

module.exports = {
    handleRoomJoin,
}
