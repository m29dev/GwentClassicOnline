const Game = require('../models/Game')

const game_create = async (req, res) => {
    try {
        const data = req.body

        console.log(data)

        const newGame = new Game({
            players: [],
            round: 1,
            stats: [],
            active: true,
        })

        const newGameCreated = await newGame.save()

        res.json(newGameCreated)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    game_create,
}
