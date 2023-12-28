const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const dbConnect = require('./config/dbConfig')
const gameRoutes = require('./routes/gameRoutes')
const roomRoutes = require('./routes/roomRoutes')
const http = require('http')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: 'http://localhost:5173',
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
        //connection event
        // await User.findByIdAndUpdate(
        //     { _id: socket.userId },
        //     { socketId: socket.id }
        // )
        console.log('user connected: ', socket.userId, socket.id)

        //socket events
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
