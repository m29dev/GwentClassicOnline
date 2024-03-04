const abilityBond = (gameInfoEdit, cardSelected) => {
    const bondArray = []

    // first check how many bond cards with same type are in game
    gameInfoEdit.player_cards_board[
        cardSelected.row === 'close' ? 0 : cardSelected.row === 'ranged' ? 1 : 2
    ].board_row_cards.map((card) => {
        if (card.name === cardSelected.name) bondArray.push(card)
        console.log(253, card.id)
    })

    if (bondArray.length > 1) {
        // second update bond cards strength (depends on how many bond cards are in game)
        gameInfoEdit.player_cards_board[
            cardSelected.row === 'close'
                ? 0
                : cardSelected.row === 'ranged'
                ? 1
                : 2
        ].board_row_cards.map((card) => {
            if (card.name === cardSelected.name) {
                card.strengthBond =
                    +cardSelected.strength +
                    cardSelected.strength * (bondArray.length - 1)

                console.log(
                    271,
                    'updated strength of card with id ',
                    card.id,
                    'is: ',
                    card.strengthBond
                )
            }
        })
    }

    return gameInfoEdit
}

module.exports = {
    abilityBond,
}
