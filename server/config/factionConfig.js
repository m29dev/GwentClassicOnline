const cards = require('../config/cardsConfig')

const getFaction = async (faction) => {
    try {
        const cardsRead = cards

        // default config
        const defaultDeck = []
        cardsRead.map((item) => {
            if (item.deck === faction && item.row !== 'leader')
                defaultDeck.push(item)
        })
        const defaultLeaders = []
        cardsRead.map((item) => {
            if (item.deck === faction && item.row === 'leader') {
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

        const res = {
            selectedDeck,
            starterCards,
            selectedLeader,
        }

        return res
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getFaction,
}
