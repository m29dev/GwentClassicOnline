const Game = require('../models/Game')
const cards = require('../config/cardsConfig')

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

const game_read_id = async (req, res) => {
    try {
        const cardsRead = cards

        // default config
        const defaultDeck = []
        cardsRead.map((item) => {
            if (item.deck === 'realms' && item.row !== 'leader')
                defaultDeck.push(item)
        })
        const defaultLeaders = []
        cardsRead.map((item) => {
            if (item.deck === 'realms' && item.row === 'leader') {
                defaultLeaders.push(item)
            }
        })

        // selected config
        const selectedDeck = []
        defaultDeck.map((item, index) => {
            if (index < 23) {
                selectedDeck.push(item)
            }
        })
        const selectedLeader = defaultLeaders?.[0]

        // randomize 10 startup cards
        const starterCards = []
        selectedDeck.map((item, index) => {
            if (index < 10) {
                starterCards.push(item)
            }
        })

        // simulate game_room 2 players info
        const player_0 = {
            // constant info

            player_id: 0,
            player_name: 'JJ',
            player_deck: 'Northern Realms', // deck name: Northern Realms
            player_deck_cards_all: selectedDeck, // deck cards, all of selected cards by player
            player_leader: selectedLeader, // deck leader selected by player

            // variable info, update each play / each round

            player_cards_current: starterCards, // all cards YET to play
            player_cards_played: [], // add each played card here

            // variable info, clear each round
            player_cards_board: [
                // cards played for each row on the board
                { board_row: 'close', board_row_cards: [] },
                { board_row: 'ranged', board_row_cards: [] },
                { board_row: 'siege', board_row_cards: [] },
            ],
        }

        const player_1 = {
            // constant info

            player_id: 1,
            player_name: 'OP',
            player_deck: 'Northern Realms', // deck name: Northern Realms
            player_deck_cards_all: selectedDeck, // deck cards, all of selected cards by player
            player_leader: defaultLeaders?.[1], // deck leader selected by player

            // variable info, update each play / each round

            player_cards_current: starterCards, // all cards YET to play
            player_cards_played: [], // add each played card here

            // variable info, clear each round
            player_cards_board: [
                // cards played for each row on the board
                { board_row: 'close', board_row_cards: [] },
                { board_row: 'ranged', board_row_cards: [] },
                { board_row: 'siege', board_row_cards: [] },
            ],
        }

        const gameInfo = [player_0, player_1]

        res.json(gameInfo)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    game_create,
    game_read_id,
}
