const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const dbConnect = require('./config/dbConfig')
const gameRoutes = require('./routes/gameRoutes')
const roomRoutes = require('./routes/roomRoutes')
const http = require('http')
const { handleRoomJoin } = require('./config/socketRoomConfig')
const {
    handleGameStart,
    handleGameInitFaction,
    handleGameCardPlay,
    handleGamePassRound,
} = require('./config/socketGameConfig')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: ['https://gwentclassic.onrender.com'],
        methods: ['GET', 'POST'],
    },
})
io.use((socket, next) => {
    const userId = socket.handshake.auth.userId
    if (!userId) {
        return next(new Error('invalid userId'))
    }
    socket.userId = userId
    next()
})
io.on('connection', async (socket) => {
    try {
        // connection event
        console.log('user connected: ', socket.userId, socket.id)

        // on room join
        socket.on('roomJoin', async ({ room_id }) => {
            await handleRoomJoin(socket, room_id)
        })

        // on send init faction data (player chooses faction)
        socket.on(
            'gameInitFaction',
            async ({ room_id, game_id, faction, cardsDeck, leaderDeck }) => {
                await handleGameInitFaction(
                    socket,
                    room_id,
                    game_id,
                    faction,
                    cardsDeck,
                    leaderDeck
                )
            }
        )

        // on card play
        socket.on(
            'gameCardPlay',
            async ({ room_id, game_id, cardSelected, agile, agileRow }) => {
                await handleGameCardPlay(
                    socket,
                    room_id,
                    game_id,
                    cardSelected,
                    agile,
                    agileRow
                )
            }
        )

        // on start the game
        socket.on('gamePassRound', async ({ room_id, game_id }) => {
            await handleGamePassRound(socket, room_id, game_id)
        })

        // on start the game
        socket.on('gameStart', async ({ room_id }) => {
            await handleGameStart(room_id)
        })

        // on end the game
        socket.on('gameEnd', async ({ room_id }) => {
            const res = await Room.findOne({ room_id })
            socket.nsp.to(room_id).emit('endGameRoom', res)
        })

        // disconnection event
        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.userId)
            socket.to(socket.id).emit('onDisconnect')
        })
    } catch (err) {
        console.log(err)
    }
})

dbConnect()
server.listen(3000, () => {
    console.log('Server runs on port 3000')
})

app.get('/api', (req, res) => {
    res.json({ message: 'Gwent Classic Online Server.' })
})

//routes
app.use(gameRoutes)
app.use(roomRoutes)
