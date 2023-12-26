import './card.css'

const CardPlayedComponent = (card) => {
    return (
        <div
            className="card"
            style={{
                backgroundImage: `url("./sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            }}
        >
            {/* display strength normal icon if card has no ability */}
            {card?.card?.strength && card?.card?.ability !== 'hero' && (
                <div
                    className="card-power-box"
                    style={{
                        backgroundImage: `url("./icons/power_normal_icon.png")`,
                    }}
                >
                    <div className="card-power">{card?.card?.strength}</div>
                </div>
            )}

            {/* display strength hero icon if card has hero ability */}
            {card?.card?.strength && card?.card?.ability === 'hero' && (
                <div
                    className="card-power-hero-box"
                    style={{
                        backgroundImage: `url("./icons/power_hero.png")`,
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
                        backgroundImage: `url("./icons/card_row_${card?.card?.row}.png")`,
                    }}
                ></div>
            )}

            {/* display ability icon if exists */}
            {card?.card?.ability && (
                <div
                    className="card-ability-box"
                    style={{
                        backgroundImage: `url("./icons/card_ability_${card?.card?.ability}.png")`,
                    }}
                ></div>
            )}
        </div>
    )
}

export default CardPlayedComponent
