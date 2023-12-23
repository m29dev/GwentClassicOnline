import CardComponent from '../../components/card/CardComponent'
import './PrivatePages.css'

const GamePage = () => {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className="game-page-container">
            <div className="left-side">
                <div className="general-player0"></div>

                <div className="weather-box"></div>

                <div className="general-player1"></div>
            </div>

            <div className="center-side">
                <div className="row-box-player0">
                    <div className="row"></div>
                    <div className="row"></div>
                    <div className="row"></div>
                </div>

                <div className="row-box-player1">
                    <div className="row"></div>
                    <div className="row"></div>
                    <div className="row"></div>
                </div>

                <div className="row-box-cards">
                    <div className="row-cards">
                        {cards?.map((item, index) => (
                            <CardComponent key={index}></CardComponent>
                        ))}
                    </div>
                </div>
            </div>

            <div className="right-side"></div>
        </div>
    )
}

export default GamePage
