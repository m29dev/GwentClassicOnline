const mongoose = require('mongoose')
const gameSchema = mongoose.Schema(
    {
        gameInfo: {
            type: Array,
            default: [],
        },
        gameRound: {
            type: Number,
        },
        gameActive: {
            type: Boolean,
        },
    },
    { timestamps: true }
)

const game = mongoose.model('Game', gameSchema)
module.exports = game
