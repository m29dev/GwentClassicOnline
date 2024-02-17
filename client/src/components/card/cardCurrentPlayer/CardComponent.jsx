import './card.css'
import { useDispatch, useSelector } from 'react-redux'
import { setGameInfo } from '../../../redux/authSlice'

const CardComponent = (card) => {
    const { gameInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const handlePlayCard = () => {
        const gameInfoEdit = structuredClone(gameInfo)
        gameInfoEdit.gamePlayerCurrent.player_card_selected = card?.card

        dispatch(setGameInfo(gameInfoEdit))
    }

    return (
        <div
            className="card"
            style={{
                backgroundImage: `url("/sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            }}
            onClick={handlePlayCard}
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
                    <div className="card-power">{card?.card?.strength}</div>
                </div>
            )}

            {/* display strength hero icon if card has hero ability */}
            {card?.card?.strength && card?.card?.ability.includes('hero') && (
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

export default CardComponent
