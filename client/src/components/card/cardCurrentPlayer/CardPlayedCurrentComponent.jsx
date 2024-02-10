import './card.css'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'

const CardPlayedCurrentComponent = (card) => {
    const { gameInfo, roomInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()

    // PLAY DECOY CARD (SELECT CARD TO SWAP WITH DECOY CARD)
    const handleSelectPlayedCard = (c) => {
        if (
            gameInfo?.gamePlayerCurrent?.player_card_selected?.ability ===
            'decoy'
        ) {
            console.log('DECOY TEST CARD SELECT: ', c)
        }

        const cardSelected = structuredClone(
            gameInfo?.gamePlayerCurrent?.player_card_selected
        )

        cardSelected.cardToSwap = c

        socket.emit('gameCardPlay', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
            cardSelected,
            agile: false,
            agileRow: null,
        })
    }

    return (
        <div
            className="card"
            style={{
                backgroundImage: `url("/sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            }}
            onClick={() => {
                handleSelectPlayedCard(card)
            }}
        >
            <div
                className="card-border"
                style={{
                    backgroundImage: `url("/icons/border_gold.png")`,
                }}
            ></div>

            {/* display strength normal icon if card has no ability */}
            {card?.card?.strength && card?.card?.ability !== 'hero' && (
                <div
                    className="card-power-box"
                    style={{
                        backgroundImage: `url("/icons/power_normal_icon.png")`,
                    }}
                >
                    <div className="card-power">
                        {card?.card?.strengthWeather
                            ? card?.card?.strengthWeather
                            : card?.card?.strength}
                    </div>
                </div>
            )}

            {/* display strength hero icon if card has hero ability */}
            {((card?.card?.strength && card?.card?.ability === 'hero') ||
                (card?.card?.strength &&
                    card?.card?.ability === 'hero spy')) && (
                <div
                    className="card-power-hero-box"
                    style={{
                        backgroundImage: `url("/icons/power_hero.png")`,
                    }}
                >
                    <div className="card-power-hero">
                        {card?.card?.strength}
                    </div>
                </div>
            )}

            {/* display row icon */}
            {card?.card?.row && (
                <div
                    className="card-row-box"
                    style={{
                        backgroundImage: `url("/icons/card_row_${card?.card?.row}.png")`,
                    }}
                ></div>
            )}

            {/* display ability icon if exists */}
            {card?.card?.ability && (
                <div
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("/icons/card_ability_${card?.card?.ability}.png")`,
                    }}
                ></div>
            )}

            {/* display spy if hero spy */}
            {card?.card?.ability === 'hero spy' && (
                <div
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("/icons/card_ability_spy.png")`,
                    }}
                ></div>
            )}
        </div>
    )
}

export default CardPlayedCurrentComponent
