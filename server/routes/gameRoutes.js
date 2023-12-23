const express = require('express')
const controller = require('../controllers/gameController.js')
const router = express.Router()

// CREATE GAME
router.post('/api/game/create', controller.game_create)

// // READ GAME
// router.get('/api/game/read/:id', controller.game_read_id)

// // UPDADTE GAME
// router.post('/api/game/update/:id', controller.game_update_id)

// // REMOVE GAME
// router.get('/api/game/remove/:id', controller.game_remove_id)

module.exports = router
