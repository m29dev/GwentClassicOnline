const { getFaction } = require('./factionConfig')
const Game = require('../models/Game')

const handleGameInitFaction = async (socket, room_id, game_id, faction) => {
    console.log('game init')

    // const { gameId, faction, playerId, playerNickname } = req.body
    const deck = await getFaction(faction)
    const game = await Game.findById({ _id: game_id })

    // console.log('game: ', game)

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
        player_deck_cards_all: deck?.selectedDeck, // deck cards, all of selected cards by player
        player_leader: deck?.selectedLeader, // deck leader selected by player

        // variable info, update each play / each round
        player_card_selected: {},
        player_cards_current: deck?.starterCards, // all cards YET to play
        player_cards_played: [], // add each played card here
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

    // REMOVE PLAYED CARD FROM CURRENT CARDS
    let updatedArray = []
    gameInfoEdit?.player_cards_current?.map((item) => {
        if (item?.id !== cardSelected?.id) {
            updatedArray.push(item)
        }
    })
    gameInfoEdit.player_cards_current = updatedArray
    // ADD PLAYED CARD TO THE BOARD ARRAY
    if (!agile) {
        gameInfoEdit.player_cards_board.map((row) => {
            if (row?.board_row === cardSelected?.row) {
                row.board_row_cards.push(cardSelected)

                // add row strength points
                row.board_row_points = row.board_row_points
                    ? +row.board_row_points + +cardSelected?.strength
                    : +cardSelected?.strength
            }
        })
    }

    if (agile) {
        gameInfoEdit.player_cards_board.map((row) => {
            if (row?.board_row === agileRow) {
                row.board_row_cards.push(cardSelected)

                // add row strength points
                row.board_row_points = row.board_row_points
                    ? +row.board_row_points + +cardSelected?.strength
                    : +cardSelected?.strength
            }
        })
    }

    // add general strength points
    gameInfoEdit.player_points = gameInfoEdit.player_points
        ? +gameInfoEdit.player_points + +cardSelected?.strength
        : +cardSelected?.strength

    // REMOVE CARD SELECTED AFTER THE PLAY
    gameInfoEdit.player_card_selected = {}

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
