import { useSelector } from 'react-redux'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/PrivatePages/HomePage'
import AuthPage from './pages/PublicPages/AuthPage'

//init socket io
import { io } from 'socket.io-client'
import GamePage from './pages/PrivatePages/GamePage'
import RoomsPage from './pages/PrivatePages/RoomsPage'
import RoomsIdPage from './pages/PrivatePages/RoomsIdPage'
const socket = io('http://localhost:3000', {
    autoConnect: false,
})

function App() {
    const { userInfo } = useSelector((state) => state.auth)
    socket.auth = { userId: userInfo?.nickname }
    socket.connect()

    return (
        <main>
            <Routes>
                {/* public routes */}
                <Route path="/auth" element={<AuthPage />} />
                {/* <Route path="/signup" element={SignUpPage}></Route> */}

                {/* private routes */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/rooms/:id" element={<RoomsIdPage />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </main>
    )
}

export default App
