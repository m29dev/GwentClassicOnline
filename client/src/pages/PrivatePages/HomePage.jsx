import './HomePage.css'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    const handleChangePage = (dest) => {
        navigate(`/${dest}`)
    }

    return (
        <div className="main-box">
            <h1>GWENT CLASSIC ONLINE</h1>
            <button
                className="btn-universal"
                onClick={() => handleChangePage('rooms')}
            >
                PLAY
            </button>
        </div>
    )
}

export default HomePage
