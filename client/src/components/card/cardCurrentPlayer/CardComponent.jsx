import './card.css'
import { useDispatch, useSelector } from 'react-redux'
import { setGameInfo } from '../../../redux/authSlice'
import CardDetailsComponent from './CardDetailsComponent'
import { useState } from 'react'

const CardComponent = (card) => {
    const { gameInfo, userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    // config
    // const handlePlayCard = () => {
    //     // objects to edit / update
    //     const gameInfoPlayer0 = structuredClone(gameInfo?.[0])
    //     const gameInfoPlayer1 = structuredClone(gameInfo?.[1])

    //     // check which is current player
    //     const currentPlayer =
    //         gameInfoPlayer0?.player_name === userInfo?.nickname
    //             ? 'player_0'
    //             : gameInfoPlayer1?.player_name === userInfo?.nickname
    //             ? 'player_1'
    //             : null

    //     if (!currentPlayer) return
    //     if (currentPlayer === 'player_0') {
    //         // REMOVE PLAYED CARD FROM CURRENT CARDS
    //         let updatedArray = []
    //         gameInfoPlayer0?.player_cards_current?.map((item) => {
    //             if (item?.id !== card?.card?.id) {
    //                 updatedArray.push(item)
    //             }
    //         })
    //         gameInfoPlayer0.player_cards_current = updatedArray

    //         // ADD PLAYED CARD TO THE BOARD ARRAY
    //         gameInfoPlayer0.player_cards_board.map((row) => {
    //             if (row?.board_row === card?.card?.row) {
    //                 row.board_row_cards.push(card.card)
    //             }
    //         })
    //     }

    //     console.log('CARD PLAYED: ', gameInfoPlayer0)

    //     const gameInfoAfterCardPlayed = [gameInfoPlayer0, gameInfoPlayer1]
    //     dispatch(setGameInfo(gameInfoAfterCardPlayed))
    // }

    const [cardDetails, setCardDetails] = useState(false)

    const handlePlayCard = () => {
        setCardDetails((state) => !state)
    }

    return (
        <>
            <div
                className="card"
                style={{
                    backgroundImage: `url("./sm/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
                }}
                onClick={handlePlayCard}
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

            {/* DISPLAY CARD DETAILS ON CARD CLICK */}
            {cardDetails && (
                <CardDetailsComponent card={card?.card}></CardDetailsComponent>
            )}
        </>
    )
}

export default CardComponent
