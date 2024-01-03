import CardComponent from '../card/cardCurrentPlayer/CardComponent'
import CardDetailsComponent from '../card/cardCurrentPlayer/CardDetailsComponent'
import { useSelector } from 'react-redux'
import CardPlayedComponent from '../card/cardCurrentPlayer/CardPlayedComponent'
import '../../pages/PrivatePages/PrivatePages.css'
// import { setGameInfo } from '../../redux/authSlice'

import { useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Popup from '../popup/Popup'

const GameComponent = () => {
    const { userInfo, gameInfo, roomInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()

    const [rowClosePoints, setRowClosePoints] = useState(null)
    const [rowRangedPoints, setRowRangedPoints] = useState(null)
    const [rowSiegePoints, setRowSiegePoints] = useState(null)

    const [rowClosePointsOpp, setRowClosePointsOpp] = useState(null)
    const [rowRangedPointsOpp, setRowRangedPointsOpp] = useState(null)
    const [rowSiegePointsOpp, setRowSiegePointsOpp] = useState(null)

    // const dispatch = useDispatch()

    // config
    const handlePlayCard = (_row) => {
        // objects to edit / update
        // const gameInfoEdit = structuredClone(gameInfo?.gamePlayerCurrent)
        // const gameInfoAll = structuredClone(gameInfo)

        const cardSelected = structuredClone(
            gameInfo?.gamePlayerCurrent?.player_card_selected
        )

        // check if it's current player turn
        if (gameInfo?.gameTurn !== userInfo?.nickname) {
            return console.log('cannot play now')
        }

        // check if cardSelected's row is equal to clicked row
        if (cardSelected?.row !== 'agile' && _row !== cardSelected?.row)
            return console.log('select right row')

        // if card is agile
        let isAgile = false
        if (cardSelected?.row === 'agile') {
            isAgile = true
        }

        // if all good send socket event
        socket.emit('gameCardPlay', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
            cardSelected,
            agile: isAgile,
            agileRow: _row,
        })

        // // REMOVE PLAYED CARD FROM CURRENT CARDS
        // let updatedArray = []
        // gameInfoEdit?.player_cards_current?.map((item) => {
        //     if (item?.id !== cardSelected?.id) {
        //         updatedArray.push(item)
        //     }
        // })
        // gameInfoEdit.player_cards_current = updatedArray

        // // ADD PLAYED CARD TO THE BOARD ARRAY
        // gameInfoEdit.player_cards_board.map((row) => {
        //     if (row?.board_row === cardSelected?.row) {
        //         row.board_row_cards.push(cardSelected)
        //     }
        // })

        // // REMOVE CARD SELECTED AFTER THE PLAY
        // gameInfoEdit.player_card_selected = {}

        // // set gameInfoEdit in the gameInfo object
        // gameInfoAll.gamePlayerCurrent = gameInfoEdit

        // dispatch(setGameInfo(gameInfoAll))
    }

    useEffect(() => {
        // close row points
        let rowClosePointsCalc = 0
        gameInfo?.gamePlayerCurrent?.player_cards_board?.[0]?.board_row_cards?.map(
            (item) => {
                rowClosePointsCalc = +rowClosePointsCalc + +item.strength
            }
        )
        setRowClosePoints(rowClosePointsCalc)
        let rowClosePointsCalcOpp = 0
        gameInfo?.gamePlayerOpponent?.player_cards_board?.[0]?.board_row_cards?.map(
            (item) => {
                rowClosePointsCalcOpp = +rowClosePointsCalcOpp + +item.strength
            }
        )
        setRowClosePointsOpp(rowClosePointsCalcOpp)

        // ranged row points
        let rowRangedPointsCalc = 0
        gameInfo?.gamePlayerCurrent?.player_cards_board?.[1]?.board_row_cards?.map(
            (item) => {
                rowRangedPointsCalc = +rowRangedPointsCalc + +item.strength
            }
        )
        setRowRangedPoints(rowRangedPointsCalc)
        let rowRangedPointsCalcOpp = 0
        gameInfo?.gamePlayerOpponent?.player_cards_board?.[1]?.board_row_cards?.map(
            (item) => {
                rowRangedPointsCalcOpp =
                    +rowRangedPointsCalcOpp + +item.strength
            }
        )
        setRowRangedPointsOpp(rowRangedPointsCalcOpp)

        // siege row points
        let rowSiegePointsCalc = 0
        gameInfo?.gamePlayerCurrent?.player_cards_board?.[2]?.board_row_cards?.map(
            (item) => {
                rowSiegePointsCalc = +rowSiegePointsCalc + +item.strength
            }
        )
        setRowSiegePoints(rowSiegePointsCalc)
        let rowSiegePointsCalcOpp = 0
        gameInfo?.gamePlayerOpponent?.player_cards_board?.[2]?.board_row_cards?.map(
            (item) => {
                rowSiegePointsCalcOpp = +rowSiegePointsCalcOpp + +item.strength
            }
        )
        setRowSiegePointsOpp(rowSiegePointsCalcOpp)
    }, [gameInfo])

    return (
        <div className="game-page-container">
            {/* LEFTSIDE */}
            <div className="left-side">
                <div className="general-player0">
                    {gameInfo?.gamePlayerOpponent?.player_name !==
                        userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.gamePlayerOpponent?.player_leader}
                        ></CardComponent>
                    )}
                </div>

                {/* PLAYER OPP INFO */}
                <div
                    className={
                        gameInfo?.gameTurn !== userInfo?.nickname
                            ? 'player0-info-box player-turn-active'
                            : 'player0-info-box'
                    }
                >
                    {/* player avatar */}
                    <div className="leftside"></div>

                    {/* player nickname, player faction */}
                    <div className="rightside-top">
                        <h2 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerOpponent?.player_name}
                        </h2>
                        <h5 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerOpponent?.player_deck}
                        </h5>
                    </div>

                    {/* player card info */}
                    <div className="rightside-bottom">
                        <div className="rb-cards-count-box"></div>
                        <div>
                            {
                                gameInfo?.gamePlayerOpponent
                                    ?.player_cards_current?.length
                            }
                        </div>
                        <div className="gs-box">
                            <div className="p0-g0"></div>
                            <div className="p0-g1"></div>
                        </div>
                    </div>

                    {/* player game score */}
                    <div className="player0-score-box">0</div>
                </div>

                <div className="weather-box"></div>

                {/* PLAYER CURR INFO */}
                <div
                    className={
                        gameInfo?.gameTurn === userInfo?.nickname
                            ? 'player1-info-box player-turn-active'
                            : 'player1-info-box'
                    }
                >
                    {/* player avatar */}
                    <div className="leftside"></div>

                    {/* player nickname, player faction */}
                    <div className="rightside-top">
                        <h2 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerCurrent?.player_name}
                        </h2>
                        <h5 style={{ margin: '0px' }}>
                            {gameInfo?.gamePlayerCurrent?.player_deck}
                        </h5>
                    </div>

                    {/* player card info */}
                    <div className="rightside-bottom">
                        <div className="rb-cards-count-box"></div>
                        <div>
                            {
                                gameInfo?.gamePlayerCurrent
                                    ?.player_cards_current?.length
                            }
                        </div>
                        <div className="gs-box">
                            <div className="p1-g0"></div>
                            <div className="p1-g1"></div>
                        </div>
                    </div>

                    {/* player game score */}
                    <div className="player1-score-box">0</div>
                </div>

                <div className="general-player1">
                    {gameInfo?.gamePlayerCurrent?.player_name ===
                        userInfo?.nickname && (
                        <CardComponent
                            card={gameInfo?.gamePlayerCurrent?.player_leader}
                        ></CardComponent>
                    )}
                </div>
            </div>

            {/* CENTER */}
            <div className="center-side">
                {/* ROW BOX OPP */}
                <div className="row-box-player0">
                    {/* ROW SIEGE */}
                    <div className="row">
                        <div className="row-points">{rowSiegePointsOpp}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerOpponent
                                    ?.player_card_selected?.row === 'siege'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('siege')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[2]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW RANGED */}
                    <div className="row">
                        <div className="row-points">{rowRangedPointsOpp}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerOpponent
                                    ?.player_card_selected?.row === 'ranged'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('ranged')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[1]?.board_row_cards?.map(
                                    (item, index) => (
                                        <CardPlayedComponent
                                            key={index}
                                            card={item}
                                        ></CardPlayedComponent>
                                    )
                                )}
                        </div>
                    </div>

                    {/* ROW CLOSE */}
                    <div className="row">
                        <div className="row-points">{rowClosePointsOpp}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerOpponent
                                    ?.player_card_selected?.row === 'close'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('close')}
                        >
                            {gameInfo?.gamePlayerOpponent?.player_name !==
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerOpponent?.player_cards_board?.[0]?.board_row_cards?.map(
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

                {/* ROW BOX CURRENT PLAYER */}
                <div className="row-box-player1">
                    {/* ROW CLOSE */}
                    <div className="row">
                        <div className="row-points">{rowClosePoints}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row ===
                                ('close' || 'agile')
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('close')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[0]?.board_row_cards?.map(
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
                        <div className="row-points">{rowRangedPoints}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row ===
                                ('ranged' || 'agile')
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('ranged')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[1]?.board_row_cards?.map(
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
                        <div className="row-points">{rowSiegePoints}</div>
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'siege'
                                    ? 'row-common-card-box row-common-active'
                                    : 'row-common-card-box'
                            }
                            onClick={() => handlePlayCard('siege')}
                        >
                            {gameInfo?.gamePlayerCurrent?.player_name ===
                                userInfo?.nickname &&
                                gameInfo?.gamePlayerCurrent?.player_cards_board?.[2]?.board_row_cards?.map(
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
                        {gameInfo?.gamePlayerCurrent?.player_name ===
                            userInfo?.nickname &&
                            gameInfo?.gamePlayerCurrent?.player_cards_current?.map(
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

            {/* RIGHTSIDE */}
            <div className="right-side">
                {/* DISPLAY CARD DETAILS ON CARD CLICK */}
                <CardDetailsComponent></CardDetailsComponent>
            </div>

            {/* ABSOLUTE POSITIONED INFO (PLAYER TURN, GAME UPDATES) */}
            <Popup></Popup>
        </div>
    )
}

export default GameComponent
