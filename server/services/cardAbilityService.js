const cards = require('../config/cardsConfig.js')

// cards which manipulate self and/or other card's strength
const handleCardMoraleService = (playerObject) => {
    const editPlayerObejct = playerObject

    // for each row look for morale ability
    editPlayerObejct.player_cards_board.map((row) => {
        let morale = []

        // first check for morale ability cards
        row.board_row_cards.map((item) => {
            if (item.ability === 'morale') {
                morale.push(item)
            }
        })

        if (morale.length <= 0) return

        // second with abilities information update card's strength
        row.board_row_cards.map((item) => {
            if (item.ability === 'special') return

            // let itemDefaultStrength = 0
            // cards.forEach((defaultCard) => {
            //     if (defaultCard.id === item.id) {
            //         itemDefaultStrength = +defaultCard.strength
            //     }
            // })
            // console.log(1, itemDefaultStrength)

            if (item.ability === 'morale') {
                if (morale.length > 1) {
                    item.strengthMorale = +item.strength + +(morale.length - 1)
                }
            } else {
                item.strengthMorale = +item.strength + +morale.length
            }
        })
    })

    // console.log('SERVICE: ', editPlayerObejct)

    return editPlayerObejct
}

const handleCardCommanderService = (playerObject) => {
    console.log(1, 'check for COMMANDERS CARDS')

    const editPlayerObejct = playerObject

    // for each row look for commander card ability
    editPlayerObejct.player_cards_board.map((row) => {
        if (row?.board_row_card_special?.ability?.includes('horn')) {
            console.log(
                'detected special card: ',
                row?.board_row_card_special,
                'for: ',
                row
            )

            row.board_row_cards.map((item) => {
                if (!item?.ability?.includes('hero')) {
                    item.strengthCommander = +item.strength + +item.strength
                }
            })
        }
    })

    return editPlayerObejct
}

module.exports = {
    handleCardMoraleService,
    handleCardCommanderService,
}
