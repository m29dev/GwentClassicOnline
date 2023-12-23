import './card.css'

const CardComponent = () => {
    return (
        <div
            className="card"
            style={{
                backgroundImage: `url("./sm/realms_sheala.jpg")`,
            }}
        >
            {/* <img className="card-bgc" src="./sm/realms_sheala.jpg" alt="" /> */}
            <img
                className="card-power"
                src="./icons/power_normal_icon.png"
                alt=""
            />
        </div>
    )
}

export default CardComponent
