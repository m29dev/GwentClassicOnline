import { useCallback, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { useRoomReadMutation } from '../../services/roomService'
import { useSelector, useDispatch } from 'react-redux'
import { useGameInitMutation } from '../../services/gameService'
import { setGameInfo, setRoomInfo } from '../../redux/authSlice'

const RoomsIdPage = () => {
    const { userInfo, roomInfo, gameInfo } = useSelector((state) => state.auth)
    const [socket] = useOutletContext()
    const params = useParams()
    const dispatch = useDispatch()

    // CHOOSE FACTION INIT GAME INFO UPDATE
    const [gameInit] = useGameInitMutation()
    const handleChooseFaction = async () => {
        try {
            const res = await gameInit({
                // playerId: userInfo?.id,
                playerNickname: userInfo?.nickname,
                gameId: roomInfo?.roomGameId,
                faction: 'realms',
            }).unwrap()
            console.log(res)

            dispatch(setGameInfo(res))
        } catch (err) {
            console.log(err)
        }
    }

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

    const gameInitFaction = async () => {
        socket.emit('gameInitFaction', {
            room_id: id,
            game_id: roomInfo?.roomGameId,
            faction: 'realms',
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

    return (
        <>
            {!gameInfo?.gameActive && (
                <>
                    <h1>Choose Faction</h1>
                    <button onClick={gameInitFaction}>Northern Realms</button>
                </>
            )}

            {gameInfo?.gameActive && <h1>init game</h1>}
        </>
    )
}

export default RoomsIdPage
