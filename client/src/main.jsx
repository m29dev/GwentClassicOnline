// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './index.css'
// import {
//     createBrowserRouter,
//     createRoutesFromElements,
//     RouterProvider,
//     Route,
//     Navigate,
// } from 'react-router-dom'
// import { store } from './redux/store'
// import { Provider } from 'react-redux'
// import AuthPage from './pages/PublicPages/AuthPage.jsx'
// import HomePage from './pages/PrivatePages/HomePage.jsx'
// import RoomsCreatePage from './pages/RoomsCreatePage.jsx'
// import RoomsIdPage from './pages/RoomsIdPage.jsx'

// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route path="/" element={<App />}>
//             <Route
//                 path="/"
//                 element={<Navigate to="/home" replace={true} />}
//             ></Route>

//             <Route path="auth" element={<AuthPage />}></Route>
//             <Route path="home" element={<HomePage />}></Route>
//             <Route path="rooms/create" element={<RoomsCreatePage />}></Route>
//             <Route path="rooms/:id" element={<RoomsIdPage />}></Route>
//         </Route>
//     )
// )

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <Provider store={store}>
//         <RouterProvider router={router} />
//     </Provider>
// )

// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import { Provider, useSelector } from 'react-redux'
// import { store } from './redux/store'
// import App from './App'
// import './index.css'
// import { io } from 'socket.io-client'

// const socket = io('http://localhost:3000', {
//     autoConnect: false,
// })

// const { userInfo } = useSelector((state) => state.auth)
// socket.auth = { userId: userInfo?.nickname }
// socket.connect()

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <App context={[socket]}></App>
//         </BrowserRouter>
//     </Provider>
// )

//
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import HomePage from './pages/PrivatePages/HomePage'
import AuthPage from './pages/PublicPages/AuthPage'
// import GamePage from './pages/PrivatePages/GamePage'
import RoomsPage from './pages/PrivatePages/RoomsPage'
import RoomsIdPage from './pages/PrivatePages/RoomsIdPage'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            {/* public routes */}
            <Route path="/auth" element={<AuthPage />} />
            {/* <Route path="/signup" element={SignUpPage}></Route> */}

            {/* private routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomsIdPage />} />
            {/* <Route path="/game" element={<GamePage />} /> */}
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)
