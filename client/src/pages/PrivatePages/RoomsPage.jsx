import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useRoomCreateMutation } from '../../services/roomService'
import { useDispatch } from 'react-redux'
import { clearGameInfo } from '../../redux/authSlice'

const RoomsPage = () => {
    const { userInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const disptach = useDispatch()

    // init config
    useEffect(() => {
        if (!userInfo) navigate('/auth')
    })

    // join room config
    const [room, setRoom] = useState('')
    const handleJoinRoom = (e) => {
        e.preventDefault()
        if (room === '') return
        navigate(`/rooms/${room}`)
    }

    // create room config
    const [roomName, setRoomName] = useState('')
    const [roomCreate] = useRoomCreateMutation()
    const onRoomCreate = async () => {
        try {
            const res = await roomCreate({
                roomName: roomName,
            }).unwrap()

            disptach(clearGameInfo())
            navigate(`/rooms/${res}`)
        } catch (err) {
            console.log(err?.data?.message)
            window.alert(err?.data?.message)
        }
    }

    return (
        <>
            <div className="page-container">
                <h1>Welcome {userInfo?.nickname}</h1>

                <hr />

                {/* join room */}
                <label>Join Room</label>
                <form className="form-container" onSubmit={handleJoinRoom}>
                    <input
                        className="form-container-input"
                        type="text"
                        placeholder="Room ID"
                        onChange={(e) => {
                            setRoom(e.target.value)
                        }}
                        value={room}
                    />
                    <Button
                        variant="dark"
                        className="form-container-btn"
                        onClick={handleJoinRoom}
                    >
                        Join room
                    </Button>
                </form>

                <hr />

                {/* create room  */}
                <label>Create Room</label>
                <form
                    className="form-container"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onRoomCreate()
                    }}
                >
                    <input
                        className="form-container-input"
                        type="text"
                        placeholder="Room ID"
                        onChange={(e) => {
                            setRoomName(e.target.value)
                        }}
                        value={roomName}
                    />

                    <Button
                        variant="dark"
                        disabled={roomName ? false : true}
                        className="form-container-btn"
                        onClick={(e) => {
                            e.preventDefault()
                            onRoomCreate()
                        }}
                    >
                        Create room
                    </Button>
                </form>
            </div>
        </>
    )
}

export default RoomsPage
