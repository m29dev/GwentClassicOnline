import { useSelector } from 'react-redux'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/PrivatePages/HomePage'
import AuthPage from './pages/PublicPages/AuthPage'

//init socket io
import { io } from 'socket.io-client'
import GamePage from './pages/PrivatePages/GamePage'
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
                <Route index path="/home" element={<HomePage />} />
                <Route index path="/game" element={<GamePage />} />
            </Routes>
        </main>
    )
}

export default App
