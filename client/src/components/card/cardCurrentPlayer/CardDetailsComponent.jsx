import { useEffect } from 'react'

const CardDetailsComponent = (card) => {
    useEffect(() => {
        console.log(`${card?.card?.deck}_${card?.card?.filename}.jpg`)
    }, [card])

    return (
        <div
            className="card-details"
            style={{
                backgroundImage: `url("./lg/${card?.card?.deck}_${card?.card?.filename}.jpg")`,
            }}
        >
            {/* <img
                src="./lg/${card?.card?.deck}_${card?.card?.filename}.jpg"
                alt=""
            /> */}
        </div>
    )
}

export default CardDetailsComponent
