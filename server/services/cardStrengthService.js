const handleCardStrength = (gameInfoEdit, gameInfoBoth) => {
    gameInfoEdit.player_cards_board.map((row) => {
        // init config
        let isWeather = false
        let morale = []
        let bond = []
        let isCommanders = false

        // #
        // #    check for any strength affecting cards
        // #

        // 0. check for weather
        gameInfoBoth.weather_row_cards.map((weather) => {
            if (weather.rowEffect === row.board_row) {
                console.log('#0     WEATHER CARD')
                isWeather = true
            }
        })

        row.board_row_cards.map((item) => {
            // reset strengthEffect
            delete item.strengthEffect

            // 1. check for morale
            if (item.ability.includes('morale')) {
                morale.push(item)
            }

            // 2. check for bond
            if (item.ability.includes('bond')) {
                bond.push(item)
            }
        })

        // 3. check for commanders
        isCommanders = row?.board_row_card_special?.ability?.includes('horn')
            ? true
            : false

        console.log('###1   MORALE LENGTH:  ', morale.length)
        console.log('###2   BOND LENGTH:  ', bond.length)

        // #
        // #    set cards strength
        // #

        row.board_row_cards.map((item) => {
            // change strength for each non hero cards
            if (!item?.ability?.includes('hero')) {
                // 0. weather
                if (isWeather) {
                    console.log('#0     weather calc')
                    return (item.strengthEffect = 1)
                }

                // 1. morale
                if (morale.length > 0) {
                    console.log('#1     morale calc')
                    morale.map((itemMorale) => {
                        if (itemMorale.name !== item.name) {
                            // item.strengthEffect = +item.strength + 1
                            item.strengthMorale = +item.strength + morale.length
                        } else if (itemMorale.id !== item.id) {
                            item.strengthMorale =
                                +item.strength + (morale.length - 1)
                        }
                    })
                }

                // 2. bond
                if (bond.length > 0) {
                    console.log('#2     bond calc')

                    // check how many same type of bond card are in the row
                    const count = bond.filter(
                        (obj) => obj.name === item.name
                    ).length

                    // calc strength
                    item.strengthBond = item.strengthMorale
                        ? item.strengthMorale * count
                        : item.strength * count
                }

                // set strengthEffect (value to display and calculate global strength)
                let theBestStrength = 0
                if (item.strength > theBestStrength) {
                    theBestStrength = +item.strength
                }
                if (item.strengthMorale > theBestStrength) {
                    theBestStrength = +item.strengthMorale
                }
                if (item.strengthBond > theBestStrength) {
                    theBestStrength = +item.strengthBond
                }

                item.strengthEffect = +theBestStrength

                // 3. commanders
                if (isCommanders) {
                    console.log('#3     commanders calc')
                    item.strengthEffect += item.strengthEffect
                }
            }
        })
    })

    return gameInfoEdit
}

const handlePlayerRowAndGlobalStrength = (gameInfoEdit) => {
    let globalStrength = 0

    gameInfoEdit.player_cards_board.map((row) => {
        rowPoints = 0

        row.board_row_cards.map((item) => {
            rowPoints += +item.strengthEffect
        })

        row.board_row_points = +rowPoints
        globalStrength += +rowPoints

        // sort by the cards strength
        const compareStrength = (a, b) => {
            return a.strength - b.strength
        }
        row.board_row_cards.sort(compareStrength)
    })

    gameInfoEdit.player_points = +globalStrength

    return gameInfoEdit
}

module.exports = {
    handleCardStrength,
    handlePlayerRowAndGlobalStrength,
}
