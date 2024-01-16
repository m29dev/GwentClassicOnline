import { useCallback, useEffect } from 'react'
import './GameFaction.css'
import { useSelector, useDispatch } from 'react-redux'
import { setMenuInfo } from '../../redux/authSlice'
import { useGameFactionsMutation } from '../../services/gameService'

const GameFactionComponent = () => {
    const { menuInfo } = useSelector((state) => state.auth)
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
                    {menuInfo?.factions?.[menuInfo?.factionId]?.faction}
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
                        style={{
                            backgroundImage: `url("/lg/${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leadersCollection?.[0]?.deck
                            }_${
                                menuInfo?.factions?.[menuInfo?.factionId]
                                    ?.leadersCollection?.[0]?.filename
                            }.jpg")`,
                        }}
                        // onClick={() => handleAddToCollection(item)}
                    ></div>
                </div>

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
