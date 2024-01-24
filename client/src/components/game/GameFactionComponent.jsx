import { useCallback, useEffect, useState } from 'react'
import './GameFaction.css'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useOutletContext } from 'react-router-dom'
import { setMenuInfo } from '../../redux/authSlice'
import { useGameFactionsMutation } from '../../services/gameService'

const GameFactionComponent = () => {
    const { roomInfo, menuInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    const params = useParams()
    const dispatch = useDispatch()

    const handleAddToDeck = (item) => {
        const menuInfoEdit = structuredClone(menuInfo)

        // add card to the DECK
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck.push(item)

        // rem card from the COLLECTION
        const collection = []
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection.map(
            (card) => {
                if (card.id !== item.id) collection.push(card)
            }
        )
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection = collection

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const handleAddToCollection = (item) => {
        const menuInfoEdit = structuredClone(menuInfo)

        // add card to the COLLECTION
        menuInfoEdit.factions[menuInfo?.factionId].cardsCollection.push(item)

        // rem card from the DECK
        const deck = []
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck.map((card) => {
            if (card.id !== item.id) deck.push(card)
        })
        menuInfoEdit.factions[menuInfo?.factionId].cardsDeck = deck

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const handleChangePage = (dir) => {
        const menuInfoEdit = structuredClone(menuInfo)
        const currentFactionId = menuInfoEdit?.factionId
        const lastFactionId = menuInfoEdit?.factions?.length - 1

        if (dir === 'prev') {
            if (currentFactionId === 0) {
                menuInfoEdit.factionId = lastFactionId
            } else {
                menuInfoEdit.factionId = currentFactionId - 1
            }
        }

        if (dir === 'next') {
            if (currentFactionId === lastFactionId) {
                menuInfoEdit.factionId = 0
            } else {
                menuInfoEdit.factionId = currentFactionId + 1
            }
        }

        dispatch(setMenuInfo(menuInfoEdit))
    }

    const [displayLeaders, setDisplayLeaders] = useState(false)
    const handleChooseLeader = (leader) => {
        console.log('choose leader')

        const menuInfoEdit = structuredClone(menuInfo)
        menuInfoEdit.factions[menuInfo?.factionId].leaderDeck = leader

        dispatch(setMenuInfo(menuInfoEdit))

        setDisplayLeaders(false)
    }

    // SEND SOCKET WITH SELECTED DECK
    const id = params.id
    const handleGameInitFaction = async () => {
        console.log('socket gameInitFaction')

        socket.emit('gameInitFaction', {
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction: menuInfo?.factions?.[menuInfo?.factionId]?.faction,
            cardsDeck: menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck,
            leaderDeck: menuInfo?.factions?.[menuInfo?.factionId]?.leaderDeck,
        })

        console.log({
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction: menuInfo?.factions?.[menuInfo?.factionId]?.faction,
            cardsDeck: menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck,
            leaderDeck: menuInfo?.factions?.[menuInfo?.factionId]?.leaderDeck,
        })
    }

    // FETCH ON INIT FULL FACTION COLLECTION IF NOT FETCHED ALREADY
    const [getFactions] = useGameFactionsMutation()
    const handleFetchFactions = useCallback(async () => {
        try {
            const res = await getFactions().unwrap()
            console.log(res)

            dispatch(setMenuInfo(res))
        } catch (err) {
            console.log(err)
        }
    }, [getFactions, dispatch])

    useEffect(() => {
        if (!menuInfo) {
            handleFetchFactions()
        }
    }, [menuInfo, handleFetchFactions])

    return (
        <div className="faction-box">
            <div className="navbar">
                <div className="navbar-left">Kolekcja Kart</div>

                <div className="navbar-center">
                    <div
                        className="btn-prev"
                        onClick={() => handleChangePage('prev')}
                    >
                        prev
                    </div>

                    {menuInfo?.factions?.[menuInfo?.factionId]?.faction}

                    <div
                        className="btn-next"
                        onClick={() => handleChangePage('next')}
                    >
                        next
                    </div>
                </div>

                <div className="navbar-right">Karty w Talii</div>
            </div>

            <div className="main-box">
                {/* COLLECTION CARDS */}
                <div className="left-box">
                    {menuInfo?.factions?.[
                        menuInfo?.factionId
                    ]?.cardsCollection?.map((item, index) => (
                        <div
                            key={index}
                            className="grid-item"
                            style={{
                                backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                            }}
                            onClick={() => handleAddToDeck(item)}
                        ></div>
                    ))}
                </div>

                {/* LEADER CARD */}
                <div className="center-box">
                    <div
                        className="grid-item"
                        // style={{
                        //     backgroundImage: `url("/lg/${
                        //         menuInfo?.factions?.[menuInfo?.factionId]
                        //             ?.leadersCollection?.[0]?.deck
                        //     }_${
                        //         menuInfo?.factions?.[menuInfo?.factionId]
                        //             ?.leadersCollection?.[0]?.filename
                        //     }.jpg")`,
                        // }}

                        style={{
                            backgroundImage: `url("/lg/${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leaderDeck?.deck
                            }_${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leaderDeck?.filename
                            }.jpg")`,
                        }}
                        onClick={() => setDisplayLeaders(true)}
                    ></div>

                    <div className="btn-start" onClick={handleGameInitFaction}>
                        READY
                    </div>
                </div>
                {/* ABSOLUTE LEADERS BLOCK */}
                {displayLeaders && (
                    <div className="center-box-absolute-leaders">
                        <div
                            className="absolute-leaders-hide"
                            onClick={() => setDisplayLeaders(false)}
                        >
                            X
                        </div>

                        {menuInfo?.factions?.[
                            menuInfo?.factionId
                        ]?.leadersCollection?.map((item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                                style={{
                                    backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                                }}
                                onClick={() => handleChooseLeader(item)}
                            ></div>
                        ))}
                    </div>
                )}

                {/* DECK CARDS */}
                <div className="right-box">
                    {menuInfo?.factions?.[menuInfo?.factionId]?.cardsDeck?.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="grid-item"
                                style={{
                                    backgroundImage: `url("/lg/${item?.deck}_${item?.filename}.jpg")`,
                                }}
                                onClick={() => handleAddToCollection(item)}
                            ></div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default GameFactionComponent
