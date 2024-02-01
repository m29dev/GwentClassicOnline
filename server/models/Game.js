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
        gameTurn: {
            type: String,
        },
        gamePlayerBoth: {
            type: Object,
        },
    },
    { timestamps: true }
)

const game = mongoose.model('Game', gameSchema)
module.exports = game
