import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRoomReadMutation } from '../../services/roomService'
import { useSelector, useDispatch } from 'react-redux'
import { useGameInitMutation } from '../../services/gameService'
import { setRoomInfo } from '../../redux/authSlice'

const RoomsIdPage = () => {
    const { userInfo, roomInfo } = useSelector((state) => state.auth)
    const params = useParams()
    const dispatch = useDispatch()

    // CHOOSE FACTION INIT GAME INFO UPDATE
    const [gameInit] = useGameInitMutation()
    const handleChooseFaction = async () => {
        try {
            const res = await gameInit({
                gameId: roomInfo?.roomGameId,
                faction: 'realms',
            }).unwrap()
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

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

    return (
        <>
            <h1>Choose Faction</h1>
            <button onClick={handleChooseFaction}>Northern Realms</button>
        </>
    )
}

export default RoomsIdPage
