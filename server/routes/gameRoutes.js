const express = require('express')
const controller = require('../controllers/gameController.js')
const router = express.Router()

// CREATE / UPDATE GAME INIT INFO
router.post('/api/game/init', controller.game_init)

// // READ GAME
router.get('/api/game/:game_id/:userId', controller.game_read_id)

// // UPDADTE GAME
// router.post('/api/game/update/:id', controller.game_update_id)

// // REMOVE GAME
// router.get('/api/game/remove/:id', controller.game_remove_id)

module.exports = router
