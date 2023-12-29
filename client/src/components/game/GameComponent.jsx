import CardComponent from '../card/cardCurrentPlayer/CardComponent'
import CardDetailsComponent from '../card/cardCurrentPlayer/CardDetailsComponent'
import { useSelector } from 'react-redux'
import CardPlayedComponent from '../card/cardCurrentPlayer/CardPlayedComponent'
import '../../pages/PrivatePages/PrivatePages.css'
// import { setGameInfo } from '../../redux/authSlice'
// import { useDispatch } from 'react-redux'
import { useOutletContext } from 'react-router-dom'

const GameComponent = () => {
    const { userInfo, gameInfo, roomInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    // const dispatch = useDispatch()

    // config
    const handlePlayCard = (_row) => {
        // objects to edit / update
        // const gameInfoEdit = structuredClone(gameInfo?.gamePlayerCurrent)
        // const gameInfoAll = structuredClone(gameInfo)
        const cardSelected = gameInfo?.gamePlayerCurrent?.player_card_selected

        // check if cardSelected's row is equal to clicked row
        if (_row !== cardSelected?.row) return console.log('select right row')

        // check if it's current player turn

        // if all good send socket event
        socket.emit('gameCardPlay', {
            room_id: roomInfo?._id,
            game_id: roomInfo?.roomGameId,
            cardSelected,
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

                <div className="weather-box"></div>

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
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'close'
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
                        <div className="row-special-card-box"></div>
                        <div
                            className={
                                gameInfo?.gamePlayerCurrent
                                    ?.player_card_selected?.row === 'ranged'
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
        </div>
    )
}

export default GameComponent
