const mongoose = require('mongoose')
const gameSchema = mongoose.Schema(
    {
        players: {
            type: Array,
            default: [],
        },
        round: {
            type: Number,
        },
        stats: {
            type: Array,
            default: [],
        },
        active: {
            type: Boolean,
        },
    },
    { timestamps: true }
)

const game = mongoose.model('Game', gameSchema)
module.exports = game
