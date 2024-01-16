import { useCallback, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { useRoomReadMutation } from '../../services/roomService'
import { useSelector, useDispatch } from 'react-redux'
import { setGameInfo, setRoomInfo } from '../../redux/authSlice'
import GameComponent from '../../components/game/GameComponent'
import GameAfterComponent from '../../components/game/GameAfterComponent'
import GameMenuComponent from '../../components/game/GameMenuComponent'
import GameFactionComponent from '../../components/game/GameFactionComponent'

const RoomsIdPage = () => {
    const { userInfo, roomInfo, gameInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    const params = useParams()
    const dispatch = useDispatch()

    // ON INIT CONFIG
    const id = params.id
    const [getRoomInfo] = useRoomReadMutation()
    const handleGetRoomInfo = useCallback(async () => {
        try {
            const res = await getRoomInfo({
                userInfoId: userInfo?.nickname,
                roomInfoId: id,
            }).unwrap()
            console.log(res)

            dispatch(setRoomInfo(res))
        } catch (err) {
            console.log(err)
        }
    }, [getRoomInfo, userInfo, id, dispatch])

    useEffect(() => {
        handleGetRoomInfo()
    }, [handleGetRoomInfo])

    // send socket
    const joinRoom = useCallback(async () => {
        socket.emit('roomJoin', {
            room_id: id,
        })
    }, [socket, id])

    useEffect(() => {
        joinRoom()
    }, [joinRoom])

    const gameInitFaction = async (faction) => {
        socket.emit('gameInitFaction', {
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction,
        })
    }

    // receive socket
    useEffect(() => {
        const handleRoomJoinData = (data) => {
            console.log(data)
        }

        socket.on('roomJoinData', (data) => handleRoomJoinData(data))

        return () => socket.off('roomJoinData', handleRoomJoinData)
    }, [socket])

    useEffect(() => {
        const handleGameInfoData = (data) => {
            console.log('gameInfoData: ', data)
            dispatch(setGameInfo(data))
        }

        socket.on('gameInfoData', (data) => handleGameInfoData(data))

        return () => socket.off('gameInfoData', handleGameInfoData)
    }, [socket, dispatch])

    // LISTEN FOR gameInfo CHANGES
    // useEffect(() => {
    //     if (gameInfo?.gameActive) {
    //         console.log('init game')
    //     }
    // }, [gameInfo])

    // useEffect(() => {
    //     if (roomInfo?.roomGameId !== gameInfo?.gameId) {
    //         dispatch(clearGameInfo())
    //     }
    // }, [roomInfo, gameInfo, dispatch])

    return (
        <>
            {/* {!gameInfo?.gameActive && (
                <>
                    <h1>Choose Faction</h1>
                    <button onClick={() => gameInitFaction('realms')}>
                        Northern Realms
                    </button>
                    <button onClick={() => gameInitFaction('scoiatael')}>
                        Scoiatael
                    </button>
                    <button onClick={() => gameInitFaction('monsters')}>
                        Monsters
                    </button>
                    <button onClick={() => gameInitFaction('nilfgaard')}>
                        Nilfgaard
                    </button>

                    <GameAfterComponent></GameAfterComponent>
                </>
            )} */}

            {/* {!gameInfo?.gameActive && <GameMenuComponent></GameMenuComponent>} */}

            {!gameInfo?.gameActive && (
                <GameFactionComponent></GameFactionComponent>
            )}

            {gameInfo?.gameActive && <GameComponent></GameComponent>}
        </>
    )
}

export default RoomsIdPage
