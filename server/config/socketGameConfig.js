const { getFaction } = require('./factionConfig')
const Game = require('../models/Game')

const handleGameInitFaction = async (
    socket,
    room_id,
    game_id,
    faction,
    cardsDeck,
    leaderDeck
) => {
    console.log('game init')

    // RANDOMIZE INIT 10 STARTER CARDS
    const currentDeck = []
    const cardsDeckNotPlayed = []
    cardsDeck.forEach((item, index) => {
        if (index < 10) {
            currentDeck.push(item)
        } else {
            cardsDeckNotPlayed.push(item)
        }
    })

    const game = await Game.findById({ _id: game_id })

    // check if gameInfo has already 2 players info
    if (game?.gameInfo?.length >= 2)
        return console.log('game info already initialized')

    // check if player who send the request already has the gameInfo object
    let cancel = false
    game.gameInfo.forEach((item) => {
        if (item.player_name === socket?.userId) {
            console.log(socket?.userId, 'already has a gameInfo object')
            cancel = true
        }
    })
    if (cancel) return

    const player_0 = {
        // constant info
        // player_id: 0, ADD LATER AN ID WITH NICKNAME
        player_name: socket?.userId,
        player_deck: faction, // deck name: Northern Realms
        // player_deck_cards_all: deck?.selectedDeck, // deck cards, all of selected cards by player
        player_deck_cards_all: cardsDeck, // deck cards, all of selected cards by player
        player_cards_not_played: cardsDeckNotPlayed,
        // player_leader: deck?.selectedLeader, // deck leader selected by player
        player_leader: leaderDeck, // deck leader selected by player

        // variable info, update each play / each round
        player_card_selected: {},
        player_cards_current: currentDeck, // all cards YET to play
        player_cards_played: [], // add each played card here

        // TEST
        player_cards_to_retrieve: [
            {
                name: 'Siege Tower',
                id: '81',
                deck: 'realms',
                row: 'siege',
                strength: '6',
                ability: '',
                filename: 'siege_tower',
                count: '1',
            },
            {
                name: 'Siegfried of Denesle',
                id: '83',
                deck: 'realms',
                row: 'close',
                strength: '5',
                ability: '',
                filename: 'siegfried',
                count: '1',
            },
            {
                name: 'Sigismund Dijkstra',
                id: '89',
                deck: 'realms',
                row: 'close',
                strength: '4',
                ability: 'spy',
                filename: 'dijkstra',
                count: '1',
            },
        ],

        player_round_active: true,

        // variable info, clear each round
        player_cards_board: [
            // cards played for each row on the board
            { board_row: 'close', board_row_cards: [] },
            { board_row: 'ranged', board_row_cards: [] },
            { board_row: 'siege', board_row_cards: [] },
        ],
    }

    game.gameInfo.push(player_0)

    // if 2 player objects exists, call socket event to start the game
    if (game.gameInfo.length === 2) {
        game.gameActive = true
        game.gameTurn = game?.gameInfo?.[0]?.player_name
    }

    const initGame = await game.save()
    let playerOpp
    initGame.gameInfo.forEach((item) => {
        if (item.player_name !== socket?.userId) {
            return (playerOpp = item)
        }
    })

    console.log('GAME ID: ', initGame?._id)

    // SEND DATA TO OPP PLAYER
    const gameInfoOpp = {
        gameId: initGame?._id,
        gameActive: initGame.gameActive,
        gameRound: initGame.gameRound,
        gamePlayerCurrent: playerOpp ? playerOpp : {},
        gamePlayerOpponent: player_0,
        gameTurn: player_0?.player_name,
    }
    // socket.nsp.to(room_id).emit('gameInfoData', gameInfoOpp)
    socket.to(room_id).emit('gameInfoData', gameInfoOpp)

    // SEND DATA TO CURR PLAYER socket.user_id
    const gameInfoCurr = {
        gameId: initGame?._id,
        gameActive: initGame.gameActive,
        gameRound: initGame.gameRound,
        gamePlayerCurrent: player_0,
        gamePlayerOpponent: playerOpp ? playerOpp : {},
        gameTurn: player_0?.player_name,
    }
    socket.nsp.to(socket.id).emit('gameInfoData', gameInfoCurr)
}

const handleGameStart = async () => {
    console.log('game start')
}

const handleGameCardPlay = async (
    socket,
    room_id,
    game_id,
    cardSelected,
    agile,
    agileRow
) => {
    console.log('PLAY A CARD')

    const game = await Game.findById({ _id: game_id })
    let gameInfoEdit
    let gameInfoEditOpp
    let calcGameTurn = game.gameTurn

    game.gameInfo.forEach((item) => {
        // check which player is current
        if (item.player_name === socket.userId) {
            gameInfoEdit = item
        } else {
            gameInfoEditOpp = item
        }

        // check which player has the turn, and set new turn to the other player
        // if (
        //     item.player_name !== game.gameTurn &&
        //     gameInfoEditOpp.player_round_active
        // ) {
        //     // check if item.player has at least 1 card
        //     if (item.player_cards_current.length >= 1) {
        //         calcGameTurn = item.player_name
        //     }
        // }
    })

    // CHANGE PLAYERS TURN
    if (
        gameInfoEditOpp.player_round_active &&
        gameInfoEditOpp.player_cards_current.length >= 1
    ) {
        calcGameTurn = gameInfoEditOpp.player_name
    }

    // CHECK IF CARD IS A MEDIC
    let isMedic = false
    if (cardSelected?.ability === 'medic') {
        isMedic = true
    }

    // REMOVE PLAYED CARD FROM CURRENT CARDS
    let updatedArray = []
    gameInfoEdit?.player_cards_current?.map((item) => {
        if (item?.id !== cardSelected?.id) {
            updatedArray.push(item)
        }
    })
    gameInfoEdit.player_cards_current = updatedArray

    // IF MEDIC, REMOVE RETRIEVED CARD FROM CARD TO RETRIEVE ARRAY
    if (isMedic) {
        let updatedArray = []
        gameInfoEdit?.player_cards_to_retrieve?.map((item) => {
            if (item?.id !== cardSelected?.cardToRetrieve?.id) {
                updatedArray.push(item)
            }
        })
        gameInfoEdit.player_cards_to_retrieve = updatedArray
    }

    // CHECK IF CARD IS A SPY
    isSpy = false
    if (cardSelected?.ability === 'spy') {
        isSpy = true
    }

    // ADD PLAYED CARD TO THE BOARD ARRAY
    // NOT A SPY
    if (!isSpy) {
        if (!agile) {
            gameInfoEdit.player_cards_board.map((row) => {
                if (row?.board_row === cardSelected?.row) {
                    row.board_row_cards.push(cardSelected)

                    if (isMedic) {
                        row.board_row_cards.push(cardSelected?.cardToRetrieve)
                    }

                    // add row strength points
                    // row.board_row_points = row.board_row_points
                    //     ? +row.board_row_points + +cardSelected?.strength
                    //     : +cardSelected?.strength
                }
            })
        }

        if (agile) {
            gameInfoEdit.player_cards_board.map((row) => {
                if (row?.board_row === agileRow) {
                    row.board_row_cards.push(cardSelected)

                    // add row strength points
                    // row.board_row_points = row.board_row_points
                    //     ? +row.board_row_points + +cardSelected?.strength
                    //     : +cardSelected?.strength
                }
            })
        }

        gameInfoEdit.player_cards_played.push(cardSelected)

        // add general strength points
        // gameInfoEdit.player_points = gameInfoEdit.player_points
        //     ? +gameInfoEdit.player_points + +cardSelected?.strength
        //     : +cardSelected?.strength
    }

    // ADD PLAYED CARD TO THE BOARD ARRAY
    // A SPY
    if (isSpy) {
        gameInfoEditOpp.player_cards_board.map((row) => {
            if (row?.board_row === cardSelected?.row) {
                row.board_row_cards.push(cardSelected)

                // add row strength points
                // row.board_row_points = row.board_row_points
                //     ? +row.board_row_points + +cardSelected?.strength
                //     : +cardSelected?.strength
            }
        })

        gameInfoEditOpp.player_cards_played.push(cardSelected)

        // ADD 2 RANDOM CARDS FROM ARRAY OF THE YET TO PLAY CARDS
        const updateCardsNotPlayed = []
        gameInfoEdit.player_cards_not_played.forEach((item, index) => {
            if (index < 2) {
                gameInfoEdit.player_cards_current.push(item)
            } else {
                updateCardsNotPlayed.push(item)
            }
        })
        // UPDATE YET TO PLAY CARDS ARRAY
        gameInfoEdit.player_cards_not_played = updateCardsNotPlayed

        // add general strength points
        gameInfoEditOpp.player_points = gameInfoEditOpp.player_points
            ? +gameInfoEditOpp.player_points + +cardSelected?.strength
            : +cardSelected?.strength
    }

    // CHECK FOR THE BOND ABILITY CARDS
    if (cardSelected.ability === 'bond') {
        console.log(244, 'cardSelected ability BOND detected')
        const bondArray = []

        // first check how many bond cards with same type are in game
        gameInfoEdit.player_cards_board[
            cardSelected.row === 'close'
                ? 0
                : cardSelected.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards.map((card) => {
            if (card.name === cardSelected.name) bondArray.push(card)
            console.log(253, card.id)
        })

        // second update bond cards strength (depends on how many bond cards are in game)
        gameInfoEdit.player_cards_board[
            cardSelected.row === 'close'
                ? 0
                : cardSelected.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards.map((card) => {
            if (card.name === cardSelected.name) {
                card.strength =
                    +cardSelected.strength +
                    cardSelected.strength * (bondArray.length - 1)

                console.log(
                    271,
                    'updated strength of card with id ',
                    card.id,
                    'is: ',
                    card.strength
                )
            }
        })

        // row.board_row_cards.map((card) => {
        //     const bondArray = [cardSelected]
        //     if (card.name === cardSelected) {
        //         bondArray.push(card)
        //     }
        // })
    }

    // REMOVE CARD SELECTED AFTER THE PLAY
    gameInfoEdit.player_card_selected = {}

    // CALCULATE STRENGTH POINTS:
    // 1. ROW STRENGTH POINTS
    let globalStrength = 0
    gameInfoEdit.player_cards_board.map((row) => {
        let rowStrength = 0
        row.board_row_cards.map((item) => {
            rowStrength = +rowStrength + +item.strength
        })

        console.log(358, 'new row strength is: ', rowStrength)

        row.board_row_points = +rowStrength
        globalStrength = +globalStrength + +rowStrength
    })

    // 2. GLOBAL STRENGTH POINTS
    gameInfoEdit.player_points = +globalStrength

    // CHECK IF ALL CARD BEEN PLAYED
    if (gameInfoEdit.player_cards_current.length === 0) {
        gameInfoEdit.player_round_active = false
    }

    // CHECK IF BOTH PLAYERS ENDED CURRENT ROUND
    let gameActiveUpdate = true
    let gameRoundWinner
    if (
        !gameInfoEdit.player_round_active &&
        !gameInfoEditOpp.player_round_active
    ) {
        // end round
        gameActiveUpdate = false

        // IF ROUND ENDS, CHECK THE WINNER
        let gameWinner = null
        if (!gameActiveUpdate) {
            if (gameInfoEdit.player_points > gameInfoEditOpp.player_points) {
                gameWinner = gameInfoEdit.player_name
            } else {
                gameWinner = gameInfoEditOpp.player_name
            }
        }

        console.log(
            `GAME ENDS. SCORE: ${gameInfoEdit.player_points}:${gameInfoEditOpp.player_points}. WINNER IS: ${gameWinner}`
        )
    }

    const updateGame = await Game.findByIdAndUpdate(
        { _id: game_id },
        {
            gameInfo: [gameInfoEdit, gameInfoEditOpp],
            gameTurn: calcGameTurn,
            gameActive: gameActiveUpdate,
        }
    )

    // SEND DATA TO OPP PLAYER
    const gameInfoOpp = {
        gameId: game_id,
        gameActive: gameActiveUpdate,
        gameRound: game.gameRound,
        gameTurn: calcGameTurn,
        gamePlayerCurrent: gameInfoEditOpp,
        gamePlayerOpponent: gameInfoEdit,
    }
    socket.to(room_id).emit('gameInfoData', gameInfoOpp)

    // SEND DATA TO CURR PLAYER socket.user_id
    const gameInfoCurr = {
        gameId: game_id,
        gameActive: gameActiveUpdate,
        gameRound: game.gameRound,
        gameTurn: calcGameTurn,
        gamePlayerCurrent: gameInfoEdit,
        gamePlayerOpponent: gameInfoEditOpp,
    }
    socket.nsp.to(socket.id).emit('gameInfoData', gameInfoCurr)
}

const handleGamePassRound = async (socket, room_id, game_id) => {
    const game = await Game.findById({ _id: game_id })
    let gameInfoEdit
    let gameInfoEditOpp

    game.gameInfo.forEach((item) => {
        if (item.player_name === socket.userId) {
            gameInfoEdit = item
        } else {
            gameInfoEditOpp = item
        }
    })

    if (!gameInfoEdit || !gameInfoEditOpp) return console.log('err')

    gameInfoEdit.player_round_active = false
    game.gameTurn = gameInfoEditOpp.player_name

    // CHECK IF BOTH PLAYERS ENDED ROUND
    if (
        !gameInfoEdit.player_round_active &&
        !gameInfoEditOpp.player_round_active
    ) {
        game.gameActive = false
    }

    await Game.findByIdAndUpdate(
        { _id: game_id },
        {
            gameInfo: [gameInfoEdit, gameInfoEditOpp],
            gameTurn: game.gameTurn,
            gameActive: game.gameActive,
        }
    )

    // SEND DATA TO OPP PLAYER
    const gameInfoOpp = {
        gameId: game_id,
        gameActive: game.gameActive,
        gameRound: game.gameRound,
        gameTurn: game.gameTurn,
        gamePlayerCurrent: gameInfoEditOpp,
        gamePlayerOpponent: gameInfoEdit,
    }
    socket.to(room_id).emit('gameInfoData', gameInfoOpp)

    // SEND DATA TO CURR PLAYER socket.user_id
    const gameInfoCurr = {
        gameId: game_id,
        gameActive: game.gameActive,
        gameRound: game.gameRound,
        gameTurn: game.gameTurn,
        gamePlayerCurrent: gameInfoEdit,
        gamePlayerOpponent: gameInfoEditOpp,
    }
    socket.nsp.to(socket.id).emit('gameInfoData', gameInfoCurr)
}

module.exports = {
    handleGameInitFaction,
    handleGameStart,
    handleGameCardPlay,
    handleGamePassRound,
}
