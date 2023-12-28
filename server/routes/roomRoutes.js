const express = require('express')
const controller = require('../controllers/roomController.js')
const router = express.Router()

// CREATE ROOM
router.post('/api/rooms/create', controller.room_create)

// // READ ROOM
router.get('/api/rooms/read/:roomId/:userId', controller.room_read)

// // UPDADTE GAME
// router.post('/api/game/update/:id', controller.game_update_id)

// // REMOVE GAME
// router.get('/api/game/remove/:id', controller.game_remove_id)

module.exports = router
