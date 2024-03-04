const Game = require('../models/Game')
const cards = require('../config/cardsConfig')
const { getFaction } = require('../config/factionConfig')

const game_init = async (req, res) => {
    try {
        // const { gameId, faction, playerId, playerNickname } = req.body
        // const deck = await getFaction(faction)

        // const game = await Game.findById({ _id: gameId })

        // // check if gameInfo has already 2 players info
        // if (game?.gameInfo?.length >= 2)
        //     return console.log('game info already initialized')

        // // check if player who send the request already has the gameInfo object
        // let cancel = false
        // game.gameInfo.forEach((item) => {
        //     if (item.player_name === playerNickname) {
        //         console.log(playerNickname, 'already has a gameInfo object')
        //         cancel = true
        //     }
        // })
        // if (cancel) return

        // const player_0 = {
        //     // constant info
        //     // player_id: 0, ADD LATER AN ID WITH NICKNAME
        //     player_name: playerNickname,
        //     player_deck: faction, // deck name: Northern Realms
        //     player_deck_cards_all: deck?.selectedDeck, // deck cards, all of selected cards by player
        //     player_leader: deck?.selectedLeader, // deck leader selected by player

        //     // variable info, update each play / each round
        //     player_card_selected: {},
        //     player_cards_current: deck?.starterCards, // all cards YET to play
        //     player_cards_played: [], // add each played card here

        //     // variable info, clear each round
        //     player_cards_board: [
        //         // cards played for each row on the board
        //         { board_row: 'close', board_row_cards: [] },
        //         { board_row: 'ranged', board_row_cards: [] },
        //         { board_row: 'siege', board_row_cards: [] },
        //     ],
        // }

        // game.gameInfo.push(player_0)
        // const initGame = await game.save()

        // let playerOpp
        // initGame.gameInfo.forEach((item) => {
        //     if (item.player_name !== playerNickname) {
        //         return (playerOpp = item)
        //     }
        // })

        // const gameInfoObject = {
        //     gameActive: initGame.gameActive,
        //     gameRound: initGame.gameActive,
        //     gamePlayerCurrent: player_0,
        //     gamePlayerOpponent: playerOpp ? playerOpp : {},
        // }

        // // if 2 player objects exists, call socket event to start the

        // res.json(gameInfoObject)

        console.log('game_init_post')
    } catch (err) {
        console.log(err)
    }
}

const game_read_id = async (req, res) => {
    try {
        // const cardsRead = cards
        // // default config
        // const defaultDeck = []
        // cardsRead.map((item) => {
        //     if (item.deck === 'realms' && item.row !== 'leader')
        //         defaultDeck.push(item)
        // })
        // const defaultLeaders = []
        // cardsRead.map((item) => {
        //     if (item.deck === 'realms' && item.row === 'leader') {
        //         defaultLeaders.push(item)
        //     }
        // })
        // // selected config
        // const selectedDeck = []
        // defaultDeck.map((item, index) => {
        //     if (index < 23) {
        //         selectedDeck.push(item)
        //     }
        // })
        // const selectedLeader = defaultLeaders?.[0]
        // // randomize 10 startup cards
        // const starterCards = []
        // selectedDeck.map((item, index) => {
        //     if (index < 10) {
        //         starterCards.push(item)
        //     }
        // })
        // // simulate game_room 2 players info
        // const player_0 = {
        //     // constant info
        //     player_id: 0,
        //     player_name: 'JJ',
        //     player_deck: 'Northern Realms', // deck name: Northern Realms
        //     player_deck_cards_all: selectedDeck, // deck cards, all of selected cards by player
        //     player_leader: selectedLeader, // deck leader selected by player
        //     // variable info, update each play / each round
        //     player_card_selected: {},
        //     player_cards_current: starterCards, // all cards YET to play
        //     player_cards_played: [], // add each played card here
        //     // variable info, clear each round
        //     player_cards_board: [
        //         // cards played for each row on the board
        //         { board_row: 'close', board_row_cards: [] },
        //         { board_row: 'ranged', board_row_cards: [] },
        //         { board_row: 'siege', board_row_cards: [] },
        //     ],
        // }
        // const player_1 = {
        //     // constant info
        //     player_id: 1,
        //     player_name: 'OP',
        //     player_deck: 'Northern Realms', // deck name: Northern Realms
        //     player_deck_cards_all: selectedDeck, // deck cards, all of selected cards by player
        //     player_leader: defaultLeaders?.[1], // deck leader selected by player
        //     // variable info, update each play / each round
        //     player_cards_current: starterCards, // all cards YET to play
        //     player_cards_played: [], // add each played card here
        //     // variable info, clear each round
        //     player_cards_board: [
        //         // cards played for each row on the board
        //         { board_row: 'close', board_row_cards: [] },
        //         { board_row: 'ranged', board_row_cards: [] },
        //         { board_row: 'siege', board_row_cards: [] },
        //     ],
        // }
        // // const gameInfo = [player_0, player_1]
        // const gameInfo = {
        //     player_current: player_0,
        //     player_opp: player_1,
        // }
        // res.json(gameInfo)

        const { game_id, userId } = req.params

        const gameInfoObject = await Game.findById({ _id: game_id })
        let gameInfoCurrent
        let gameInfoOpponent

        gameInfoObject.gameInfo.forEach((item) => {
            if (item.player_name === userId) {
                gameInfoCurrent = item
            } else {
                gameInfoOpponent = item
            }
        })

        const gameInfoObjectFix = {
            gameActive: gameInfoObject.gameActive,
            gameId: gameInfoObject._id,
            gamePlayerCurrent: gameInfoCurrent,
            gamePlayerOpponent: gameInfoOpponent,
            gamePlayerBoth: gameInfoObject.gamePlayerBoth,
            gameTurn: gameInfoObject.gameTurn,
        }

        res.json(gameInfoObjectFix)
    } catch (err) {
        console.log(err)
    }
}

const game_factions = async (req, res) => {
    try {
        console.log('reached factions')
        const factions = ['realms', 'nilfgaard', 'monsters', 'scoiatael']
        const factionsInfo = {
            factionId: 0,
            factions: [],
        }

        factions.forEach((faction) => {
            let factionObject = {
                faction: faction,
                cardsCollection: [],
                cardsDeck: [],
                leadersCollection: [],
                leaderDeck: {},
            }

            cards.forEach((item) => {
                if (
                    item.deck === faction ||
                    item.deck === 'weather' ||
                    item.deck === 'special' ||
                    item.deck === 'neutral'
                ) {
                    item.row !== 'leader'
                        ? factionObject.cardsCollection.push(item)
                        : factionObject.leadersCollection.push(item)
                }
            })

            factionObject.leaderDeck = factionObject.leadersCollection[0]

            factionsInfo.factions.push(factionObject)
        })

        res.json(factionsInfo)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    game_init,
    game_read_id,
    game_factions,
}
