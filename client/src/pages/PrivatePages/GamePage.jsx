import { useCallback, useEffect } from 'react'
import CardComponent from '../../components/card/cardCurrentPlayer/CardComponent'
import './PrivatePages.css'
import { useGameReadIdMutation } from '../../services/gameService'
import { useDispatch, useSelector } from 'react-redux'
import { setGameInfo } from '../../redux/authSlice'
import CardPlayedComponent from '../../components/card/cardCurrentPlayer/CardPlayedComponent'

const GamePage = () => {
    const { gameInfo, userInfo } = useSelector((state) => state.auth)

    // const [deck, setDeck] = useState([])
    const dispatch = useDispatch()

    const [gameRead] = useGameReadIdMutation()
    const handleGameRead = useCallback(async () => {
        try {
            const res = await gameRead().unwrap()
            console.log(res)

            // setDeck(res)
            dispatch(setGameInfo(res))
        } catch (err) {
            console.log(err)
        }
    }, [gameRead, dispatch])

    useEffect(() => {
        handleGameRead()
    }, [handleGameRead])

    return (
        <div className="game-page-container">
            <div className="left-side">
                <div className="general-player0"></div>

                <div className="weather-box"></div>

                <div className="general-player1">
                    {gameInfo?.[0]?.player_name === userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.[0]?.player_leader}
                        ></CardComponent>
                    )}

                    {gameInfo?.[1]?.player_name === userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.[1]?.player_leader}
                        ></CardComponent>
                    )}
                </div>
            </div>

            <div className="center-side">
                {/* ROW BOX OPP */}
                <div className="row-box-player0">
                    <div className="row"></div>
                    <div className="row"></div>
                    <div className="row"></div>
                </div>

                {/* ROW BOX CURRENT PLAYER */}
                <div className="row-box-player1">
                    {/* ROW CLOSE */}
                    <div className="row">
                        <div className="row-special-card-box"></div>
                        <div className="row-common-card-box">
                            {gameInfo?.[0]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[0]?.player_cards_board?.[0]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}

                            {gameInfo?.[1]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[1]?.player_cards_board?.[0]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW RANGE */}
                    <div className="row">
                        <div className="row-special-card-box"></div>
                        <div className="row-common-card-box">
                            {gameInfo?.[0]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[0]?.player_cards_board?.[1]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}

                            {gameInfo?.[1]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[1]?.player_cards_board?.[1]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW SIEGE */}
                    <div className="row">
                        <div className="row-special-card-box"></div>
                        <div className="row-common-card-box">
                            {gameInfo?.[0]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[0]?.player_cards_board?.[2]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}

                            {gameInfo?.[1]?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.[1]?.player_cards_board?.[2]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>
                </div>

                {/* CURRENT CARDS ROW */}
                <div className="row-box-cards">
                    <div
                        className="row-cards"
                        style={
                            gameInfo?.length >= 10
                                ? { justifyContent: 'flex-start' }
                                : {}
                        }
                    >
                        {gameInfo?.[0]?.player_name === userInfo?.nickname &&
                            gameInfo?.[0]?.player_cards_current?.map(
                                (item, index) => (
                                    <CardComponent
                                        key={index}
                                        card={item}
                                    ></CardComponent>
                                )
                            )}

                        {gameInfo?.[1]?.player_name === userInfo?.nickname &&
                            gameInfo?.[1]?.player_cards_current?.map(
                                (item, index) => (
                                    <CardComponent
                                        key={index}
                                        card={item}
                                    ></CardComponent>
                                )
                            )}
                    </div>
                </div>
            </div>

            {/* DISPLAY CARD DETAILS ON CARD CLICK */}
            {/* {cardDetails && <CardDetailsComponent></CardDetailsComponent>} */}

            <div className="right-side"></div>
        </div>
    )
}

export default GamePage
