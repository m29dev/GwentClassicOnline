import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const CardDetailsComponent = () => {
    const { gameInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        console.log(gameInfo?.player_current?.player_card_selected)
    }, [gameInfo])

    return (
        <div
            className="card-details"
            style={{
                backgroundImage: `url("./lg/${gameInfo?.player_current?.player_card_selected?.deck}_${gameInfo?.player_current?.player_card_selected?.filename}.jpg")`,
            }}
        ></div>
    )
}

export default CardDetailsComponent
