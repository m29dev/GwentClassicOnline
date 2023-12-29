// import { useCallback, useEffect } from 'react'
// import CardComponent from '../../components/card/cardCurrentPlayer/CardComponent'
// import './PrivatePages.css'
// import { useGameReadIdMutation } from '../../services/gameService'
// import { useDispatch, useSelector } from 'react-redux'
// import { setGameInfo } from '../../redux/authSlice'
// import CardPlayedComponent from '../../components/card/cardCurrentPlayer/CardPlayedComponent'
// import CardDetailsComponent from '../../components/card/cardCurrentPlayer/CardDetailsComponent'

// const GamePage = () => {
//     const { gameInfo, userInfo } = useSelector((state) => state.auth)

//     // const [deck, setDeck] = useState([])
//     const dispatch = useDispatch()

//     // config
//     const handlePlayCard = (_row) => {
//         // objects to edit / update
//         const gameInfoPlayer0 = structuredClone(gameInfo?.player_current)
//         const gameInfoPlayer1 = gameInfo?.player_opp
//         const cardSelected = gameInfo?.player_current?.player_card_selected

//         // check if cardSelected's row is equal to clicked row
//         if (_row !== cardSelected?.row) return console.log('select right row')
//         // check if it's current player turn
//         // add later

//         // REMOVE PLAYED CARD FROM CURRENT CARDS
//         let updatedArray = []
//         gameInfoPlayer0?.player_cards_current?.map((item) => {
//             if (item?.id !== cardSelected?.id) {
//                 updatedArray.push(item)
//             }
//         })
//         gameInfoPlayer0.player_cards_current = updatedArray

//         // ADD PLAYED CARD TO THE BOARD ARRAY
//         gameInfoPlayer0.player_cards_board.map((row) => {
//             if (row?.board_row === cardSelected?.row) {
//                 row.board_row_cards.push(cardSelected)
//             }
//         })

//         // REMOVE CARD SELECTED AFTER THE PLAY
//         gameInfoPlayer0.player_card_selected = {}

//         const gameInfoAfterCardPlayed = {
//             player_current: gameInfoPlayer0,
//             player_opp: gameInfoPlayer1,
//         }

//         dispatch(setGameInfo(gameInfoAfterCardPlayed))
//     }

//     const [gameRead] = useGameReadIdMutation()
//     const handleGameRead = useCallback(async () => {
//         try {
//             const res = await gameRead().unwrap()
//             console.log(res)

//             // setDeck(res)
//             // dispatch(setGameInfo(res))
//         } catch (err) {
//             console.log(err)
//         }
//     }, [gameRead])

//     useEffect(() => {
//         handleGameRead()
//     }, [handleGameRead])

//     return (
//         <div className="game-page-container">
//             <div className="left-side">
//                 <div className="general-player0">
//                     <CardComponent
//                         card={gameInfo?.gamePlayerOpponent?.player_leader}
//                     ></CardComponent>
//                 </div>

//                 <div className="weather-box"></div>

//                 <div className="general-player1">
//                     {gameInfo?.gamePlayerCurrent?.player_name ===
//                         userInfo?.nickname && (
//                         <CardComponent
//                             card={gameInfo?.gamePlayerCurrent?.player_leader}
//                         ></CardComponent>
//                     )}
//                 </div>
//             </div>

//             <div className="center-side">
//                 {/* ROW BOX OPP */}
//                 <div className="row-box-player0">
//                     <div className="row"></div>
//                     <div className="row"></div>
//                     <div className="row"></div>
//                 </div>

//                 {/* ROW BOX CURRENT PLAYER */}
//                 <div className="row-box-player1">
//                     {/* ROW CLOSE */}
//                     <div className="row">
//                         <div className="row-special-card-box"></div>
//                         <div
//                             className={
//                                 gameInfo?.gamePlayerCurrent
//                                     ?.player_card_selected?.row === 'close'
//                                     ? 'row-common-card-box row-common-active'
//                                     : 'row-common-card-box'
//                             }
//                             onClick={() => handlePlayCard('close')}
//                         >
//                             {gameInfo?.gamePlayerCurrent?.player_name ===
//                                 userInfo?.nickname &&
//                                 gameInfo?.gamePlayerCurrent?.player_cards_board?.[0]?.board_row_cards?.map(
//                                     (item, index) => (
//                                         <CardPlayedComponent
//                                             key={index}
//                                             card={item}
//                                         ></CardPlayedComponent>
//                                     )
//                                 )}
//                         </div>
//                     </div>

//                     {/* ROW RANGE */}
//                     <div className="row">
//                         <div className="row-special-card-box"></div>
//                         <div
//                             className={
//                                 gameInfo?.gamePlayerCurrent
//                                     ?.player_card_selected?.row === 'ranged'
//                                     ? 'row-common-card-box row-common-active'
//                                     : 'row-common-card-box'
//                             }
//                             onClick={() => handlePlayCard('ranged')}
//                         >
//                             {gameInfo?.gamePlayerCurrent?.player_name ===
//                                 userInfo?.nickname &&
//                                 gameInfo?.gamePlayerCurrent?.player_cards_board?.[1]?.board_row_cards?.map(
//                                     (item, index) => (
//                                         <CardPlayedComponent
//                                             key={index}
//                                             card={item}
//                                         ></CardPlayedComponent>
//                                     )
//                                 )}
//                         </div>
//                     </div>

//                     {/* ROW SIEGE */}
//                     <div className="row">
//                         <div className="row-special-card-box"></div>
//                         <div
//                             className={
//                                 gameInfo?.gamePlayerCurrent
//                                     ?.player_card_selected?.row === 'siege'
//                                     ? 'row-common-card-box row-common-active'
//                                     : 'row-common-card-box'
//                             }
//                             onClick={() => handlePlayCard('siege')}
//                         >
//                             {gameInfo?.gamePlayerCurrent?.player_name ===
//                                 userInfo?.nickname &&
//                                 gameInfo?.gamePlayerCurrent?.player_cards_board?.[2]?.board_row_cards?.map(
//                                     (item, index) => (
//                                         <CardPlayedComponent
//                                             key={index}
//                                             card={item}
//                                         ></CardPlayedComponent>
//                                     )
//                                 )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* CURRENT CARDS ROW */}
//                 <div className="row-box-cards">
//                     <div
//                         className="row-cards"
//                         style={
//                             gameInfo?.length >= 10
//                                 ? { justifyContent: 'flex-start' }
//                                 : {}
//                         }
//                     >
//                         {gameInfo?.gamePlayerCurrent?.player_name ===
//                             userInfo?.nickname &&
//                             gameInfo?.gamePlayerCurrent?.player_cards_current?.map(
//                                 (item, index) => (
//                                     <CardComponent
//                                         key={index}
//                                         card={item}
//                                     ></CardComponent>
//                                 )
//                             )}
//                     </div>
//                 </div>
//             </div>

//             {/* DISPLAY CARD DETAILS ON CARD CLICK */}
//             {/* {cardDetails && <CardDetailsComponent></CardDetailsComponent>} */}

//             <div className="right-side">
//                 {/* DISPLAY CARD DETAILS ON CARD CLICK */}
//                 <CardDetailsComponent></CardDetailsComponent>
//             </div>
//         </div>
//     )
// }

// export default GamePage
