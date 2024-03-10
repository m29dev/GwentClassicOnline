const { getFaction } = require('./factionConfig')
const Game = require('../models/Game')
const {
    handleCardMoraleService,
    handleCardCommanderService,
} = require('../services/cardAbilityService')
const { abilityBond } = require('../services/abilityBondService')
const {
    handleCardStrength,
    handlePlayerRowAndGlobalStrength,
} = require('../services/cardStrengthService')
const cards = require('./cardsConfig')

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
    const shuffled = cardsDeck.sort(() => 0.5 - Math.random())
    const currentDeck = []
    const cardsDeckNotPlayed = []
    shuffled.forEach((item, index) => {
        if (index < 10) {
            currentDeck.push(item)
        } else {
            cardsDeckNotPlayed.push(item)
        }
    })

    // sort by the cards strength
    const compareStrength = (a, b) => {
        return a.strength - b.strength
    }
    currentDeck.sort(compareStrength)

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
        // player_cards_to_retrieve: [
        //     {
        //         name: 'Siege Tower',
        //         id: '81',
        //         deck: 'realms',
        //         row: 'siege',
        //         strength: '6',
        //         ability: '',
        //         filename: 'siege_tower',
        //         count: '1',
        //     },
        //     {
        //         name: 'Siegfried of Denesle',
        //         id: '83',
        //         deck: 'realms',
        //         row: 'close',
        //         strength: '5',
        //         ability: '',
        //         filename: 'siegfried',
        //         count: '1',
        //     },
        //     {
        //         name: 'Sigismund Dijkstra',
        //         id: '89',
        //         deck: 'realms',
        //         row: 'close',
        //         strength: '4',
        //         ability: 'spy',
        //         filename: 'dijkstra',
        //         count: '1',
        //     },
        // ],

        player_round_active: true,

        // variable info, clear each round
        player_cards_board: [
            // cards played for each row on the board
            {
                board_row: 'close',
                board_row_cards: [],
                board_row_card_special: null,
            },
            {
                board_row: 'ranged',
                board_row_cards: [],
                board_row_card_special: null,
            },
            {
                board_row: 'siege',
                board_row_cards: [],
                board_row_card_special: null,
            },
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
        gamePlayerBoth: initGame?.gamePlayerBoth,
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
        gamePlayerBoth: initGame?.gamePlayerBoth,
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

    // CHECK IF CARD IS A WEATHER
    let isWeather = false
    if (cardSelected?.deck === 'weather') {
        // add weather card to the weather array
        // gameInfoEdit.player_cards_board[3].board_row_cards.push(cardSelected)
        isWeather = true

        // check if weather card with same  ability is already in the game
        isDuplicat = false
        game.gamePlayerBoth.weather_row_cards.forEach((weather) => {
            if (weather.ability === cardSelected?.ability) {
                isDuplicat = true
            }
        })

        if (!isDuplicat) {
            if (cardSelected?.ability === 'clear') {
                game.gamePlayerBoth.weather_row_cards = [cardSelected]
            } else {
                game.gamePlayerBoth.weather_row_cards.push(cardSelected)
            }
        }

        console.log(214, 'WEATHER HAS BEEN DETECTED')

        // ({
        //     board_row: 'weather',
        //     board_row_cards: [cardSelected],
        // })
    }

    // CHECK IF CARD IS A SCORCH
    if (cardSelected?.ability?.includes('scorch')) {
        let strongestCard = { strengthToCompare: -1 }

        console.log(111111, 'SCORCH CARD PLAYED')

        // ! update later to search for ANY strongest cards  not only opponents cards

        // gameInfoEditOpp.player_cards_board[0].board_row_cards.map((item) => {
        //     if (!item.ability.includes('hero')) {
        //         strongestCard =
        //             item?.strength > strongestCard?.strength
        //                 ? item
        //                 : strongestCard
        //     }
        // })

        gameInfoEditOpp.player_cards_board.map((row) => {
            row.board_row_cards.map((item) => {
                if (!item.ability.includes('hero')) {
                    // if item has strengthBond
                    if (item?.strengthBond) {
                        if (
                            item?.strengthBond >
                            strongestCard?.strengthToCompare
                        ) {
                            strongestCard = item
                            strongestCard.strengthToCompare = item.strengthBond
                        }
                    }

                    // if item has default strength only
                    if (!item?.strengthBond) {
                        if (item?.strength > strongestCard?.strengthToCompare) {
                            strongestCard = item
                            strongestCard.strengthToCompare = item.strength
                        }
                    }
                }
            })
        })

        console.log(111111, 'THE STRONGEST: ', strongestCard)

        const updatedArray = []
        const cardsToRetrieve = []
        gameInfoEditOpp.player_cards_board[
            strongestCard?.row === 'close'
                ? 0
                : strongestCard?.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards.map((item) => {
            if (item.name !== strongestCard.name) {
                updatedArray.push(item)
            } else {
                delete item.strengthBond
                delete item.strengthWeather
                delete item.strengthMorale
                cardsToRetrieve.push(item)
            }
        })

        console.log(111111, 'cardsToRetrieve: ', cardsToRetrieve)

        gameInfoEditOpp.player_cards_board[
            strongestCard?.row === 'close'
                ? 0
                : strongestCard?.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards = updatedArray
        if (!gameInfoEditOpp.player_cards_to_retrieve) {
            gameInfoEditOpp.player_cards_to_retrieve = []
        }
        gameInfoEditOpp.player_cards_to_retrieve.push(...cardsToRetrieve)
    }

    // CHECK IF CARD IS A DECOY
    if (cardSelected?.ability?.includes('decoy')) {
        const cardToSwap = cardSelected?.cardToSwap?.card
        delete cardSelected.cardToSwap

        gameInfoEdit.player_cards_board.map((row) => {
            if (row?.board_row === cardToSwap?.row) {
                const updateArray = []

                row.board_row_cards.map((item) => {
                    if (item?.id !== cardToSwap?.id) {
                        updateArray.push(item)
                    }
                })
                updateArray.push(cardSelected)

                row.board_row_cards = updateArray
            }
        })

        if (cardToSwap?.ability.includes('bond')) {
            gameInfoEdit = abilityBond(gameInfoEdit, cardToSwap)
        }

        // remove all additional strength
        delete cardToSwap?.strengthBond
        delete cardToSwap?.strengthWeather
        delete cardToSwap?.strengthMorale
        delete cardToSwap?.strengthEffect

        gameInfoEdit.player_cards_current.push(cardToSwap)
    }

    // CHECK IF CARD IS A MUSTER
    if (cardSelected?.ability?.includes('muster')) {
        let currentCardsUpdate = []
        let deckCardsUpdate = []

        let musterCardsArr = []

        const fetchMusterId = cardSelected?.fetchMusterId

        // check for all muster_fetch cards in the deck and in the currents cards
        gameInfoEdit.player_cards_current.map((item) => {
            if (
                item?.ability?.includes('muster') &&
                fetchMusterId?.includes(+item?.id)
            ) {
                musterCardsArr.push(item)
            } else {
                currentCardsUpdate.push(item)
            }
        })
        gameInfoEdit.player_cards_current = currentCardsUpdate

        gameInfoEdit.player_cards_not_played.map((item) => {
            if (
                item?.ability?.includes('muster') &&
                fetchMusterId?.includes(+item?.id)
            ) {
                musterCardsArr.push(item)
            } else {
                deckCardsUpdate.push(item)
            }
        })
        gameInfoEdit.player_cards_not_played = deckCardsUpdate

        gameInfoEdit.player_cards_board[
            cardSelected?.row === 'close'
                ? 0
                : cardSelected?.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards.push(...musterCardsArr)
    }

    // CHECK IF CARD IS A MEDIC
    let isMedic = false
    if (cardSelected?.ability?.includes('medic')) {
        isMedic = true
    }

    if (isMedic) {
        // IF MEDIC, REMOVE RETRIEVED CARD FROM CARD TO RETRIEVE ARRAY
        let updatedArray = []
        gameInfoEdit?.player_cards_to_retrieve?.map((item) => {
            if (item?.id !== cardSelected?.cardToRetrieve?.id) {
                updatedArray.push(item)
            }
        })
        gameInfoEdit.player_cards_to_retrieve = updatedArray

        // IF CARD TO RETREIVE BY MEDIC IS NOT A SPY
        if (!cardSelected?.cardToRetrieve?.ability.includes('spy')) {
            gameInfoEdit.player_cards_board.map((row) => {
                if (row?.board_row === cardSelected?.cardToRetrieve?.row) {
                    row.board_row_cards.push(cardSelected?.cardToRetrieve)

                    //add row strength points
                    row.board_row_points = row.board_row_points
                        ? +row.board_row_points +
                          +cardSelected?.cardToRetrieve?.strength
                        : +cardSelected?.cardToRetrieve?.strength
                }
            })

            if (cardSelected?.cardToRetrieve?.ability.includes('bond')) {
                console.log(374000, 'CARD TO RETRIEVE IS A BOND ABILITY CARD')

                gameInfoEdit = abilityBond(
                    gameInfoEdit,
                    cardSelected?.cardToRetrieve
                )
            }
        }

        // IF CARD TO RETREIVE BY MEDIC IS A SPY
        if (cardSelected?.cardToRetrieve?.ability.includes('spy')) {
            // ADD THE SPY CARD TO THE OPP'S BOARD
            gameInfoEditOpp.player_cards_board.map((row) => {
                if (row?.board_row === cardSelected?.cardToRetrieve?.row) {
                    row.board_row_cards.push(cardSelected?.cardToRetrieve)

                    //add row strength points
                    row.board_row_points = row.board_row_points
                        ? +row.board_row_points +
                          +cardSelected?.cardToRetrieve?.strength
                        : +cardSelected?.cardToRetrieve?.strength
                }
            })

            // ADD 2 RANDOM CARD TO CURR'S PLAYER CARDS_CURRENT ARRAY
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
    }

    // CHECK IF CARD IS A SPY
    isSpy = false
    if (cardSelected?.ability.includes('spy')) {
        isSpy = true
    }

    // CHECK IF CARD IS SPECIAL ROW CARD

    if (cardSelected?.row?.includes('special')) {
        gameInfoEdit.player_cards_board.map((row) => {
            if (cardSelected?.row?.includes(row?.board_row)) {
                row.board_row_card_special = cardSelected
            }
        })
    }

    if (!isSpy && !isWeather && cardSelected?.ability !== 'scorch') {
        // ADD PLAYED CARD TO THE BOARD ARRAY
        // NOT A SPY
        if (!agile) {
            gameInfoEdit.player_cards_board.map((row) => {
                if (row?.board_row === cardSelected?.row) {
                    row.board_row_cards.push(cardSelected)
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
                row.board_row_points = row.board_row_points
                    ? +row.board_row_points + +cardSelected?.strength
                    : +cardSelected?.strength
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

    // // CHECK FOR THE BOND ABILITY CARDS
    // if (cardSelected.ability === 'bond') {
    //     console.log(244, 'cardSelected ability BOND detected')

    //     gameInfoEdit = abilityBond(gameInfoEdit, cardSelected)
    // }

    // // calc strength if any morale cards detected
    // const updatedGameInfoEditMorale = handleCardMoraleService(gameInfoEdit)
    // gameInfoEdit = updatedGameInfoEditMorale

    // // calc strength if any commanders cards detected
    // const updatedGameInfoEditCommander =
    //     handleCardCommanderService(gameInfoEdit)
    // gameInfoEdit = updatedGameInfoEditCommander

    // REMOVE CARD SELECTED AFTER THE PLAY
    gameInfoEdit.player_card_selected = {}

    // // CHECK ALL WEATHER CARDS (WILL BE NEEDED IN CALCULATION OF THE CARD'S STRENGTH)
    // game.gamePlayerBoth.weather_row_cards.map((item) => {
    //     // close
    //     if (item.ability === 'frost') {
    //         // change strength of the row's cards
    //         gameInfoEdit.player_cards_board[0].board_row_cards.map((item) => {
    //             if (!item.ability.includes('hero')) item.strengthWeather = 1
    //         })
    //         gameInfoEditOpp.player_cards_board[0].board_row_cards.map(
    //             (item) => {
    //                 if (!item.ability.includes('hero')) item.strengthWeather = 1
    //             }
    //         )
    //     }

    //     // ranged
    //     if (item.ability === 'fog') {
    //         gameInfoEdit.player_cards_board[1].board_row_cards.map((item) => {
    //             if (!item.ability.includes('hero')) item.strengthWeather = 1
    //         })
    //         gameInfoEditOpp.player_cards_board[1].board_row_cards.map(
    //             (item) => {
    //                 if (!item.ability.includes('hero')) item.strengthWeather = 1
    //             }
    //         )
    //     }

    //     // siege
    //     if (item.ability === 'rain') {
    //         gameInfoEdit.player_cards_board[2].board_row_cards.map((item) => {
    //             if (!item.ability.includes('hero')) item.strengthWeather = 1
    //         })
    //         gameInfoEditOpp.player_cards_board[2].board_row_cards.map(
    //             (item) => {
    //                 if (!item.ability.includes('hero')) item.strengthWeather = 1
    //             }
    //         )
    //     }

    //     // CLEAR WEATHER
    //     if (item.ability === 'clear') {
    //         console.log('strengthWeather CLEARED')

    //         gameInfoEdit.player_cards_board.map((row) => {
    //             row.board_row_cards.map((item) => {
    //                 delete item.strengthWeather
    //             })
    //         })
    //         gameInfoEditOpp.player_cards_board.map((row) => {
    //             row.board_row_cards.map((item) => {
    //                 delete item.strengthWeather
    //             })
    //         })
    //     }
    // })

    gameInfoEdit = handleCardStrength(gameInfoEdit, game?.gamePlayerBoth)
    gameInfoEditOpp = handleCardStrength(gameInfoEditOpp, game?.gamePlayerBoth)

    // sort by the cards strength
    const compareStrength = (a, b) => {
        return a.strength - b.strength
    }
    gameInfoEdit.player_cards_current.sort(compareStrength)
    gameInfoEditOpp.player_cards_current.sort(compareStrength)

    // CALCULATE STRENGTH POINTS:
    // 1. ROW STRENGTH POINTS
    // let globalStrength = 0
    // gameInfoEdit.player_cards_board.map((row) => {
    //     let rowStrength = 0

    //     row.board_row_cards.map((item) => {
    //         if (item.strengthWeather) {
    //             rowStrength = +rowStrength + +1
    //         } else if (item.strengthBond) {
    //             rowStrength = +rowStrength + +item.strengthBond
    //         } else {
    //             rowStrength = +rowStrength + +item.strength
    //         }
    //     })

    //     row.board_row_points = +rowStrength
    //     globalStrength = +globalStrength + +rowStrength

    //     // sort by the cards strength
    //     const compareStrength = (a, b) => {
    //         return a.strength - b.strength
    //     }
    //     row.board_row_cards.sort(compareStrength)
    // })

    // let globalStrengthOpp = 0
    // gameInfoEditOpp.player_cards_board.map((row) => {
    //     let rowStrength = 0
    //     row.board_row_cards.map((item) => {
    //         if (item.strengthWeather) {
    //             rowStrength = +rowStrength + +1
    //         } else if (item.strengthBond) {
    //             rowStrength = +rowStrength + +item.strengthBond
    //         } else {
    //             rowStrength = +rowStrength + +item.strength
    //         }
    //     })

    //     row.board_row_points = +rowStrength
    //     globalStrengthOpp = +globalStrengthOpp + +rowStrength

    //     // sort by the cards strength
    //     const compareStrength = (a, b) => {
    //         return a.strength - b.strength
    //     }
    //     row.board_row_cards.sort(compareStrength)
    // })

    // // 2. ROW AND GLOBAL STRENGTH POINTS
    // gameInfoEdit.player_points = +globalStrength
    // gameInfoEditOpp.player_points = +globalStrengthOpp

    // ROW AND GLOBAL STRENGTH
    gameInfoEdit = handlePlayerRowAndGlobalStrength(gameInfoEdit)
    gameInfoEditOpp = handlePlayerRowAndGlobalStrength(gameInfoEditOpp)

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
            gamePlayerBoth: game.gamePlayerBoth,
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
        gamePlayerBoth: game.gamePlayerBoth,
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
        gamePlayerBoth: game.gamePlayerBoth,
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
