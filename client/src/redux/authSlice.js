import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,

    roomInfo: localStorage.getItem('roomInfo')
        ? JSON.parse(localStorage.getItem('roomInfo'))
        : null,

    gameInfo: localStorage.getItem('gameInfo')
        ? JSON.parse(localStorage.getItem('gameInfo'))
        : null,

    menuInfo: localStorage.getItem('menuInfo')
        ? JSON.parse(localStorage.getItem('menuInfo'))
        : null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // authorization information
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        clearUserInfo: (state) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        },

        // room information
        setRoomInfo: (state, action) => {
            state.roomInfo = action.payload
            localStorage.setItem('roomInfo', JSON.stringify(action.payload))
        },
        clearRoomInfo: (state) => {
            state.roomInfo = null
            localStorage.removeItem('roomInfo')
        },

        // game information
        setGameInfo: (state, action) => {
            state.gameInfo = action.payload
            localStorage.setItem('gameInfo', JSON.stringify(action.payload))
        },
        clearGameInfo: (state) => {
            state.gameInfo = null
            localStorage.removeItem('gameInfo')
        },

        // menu information
        setMenuInfo: (state, action) => {
            state.menuInfo = action.payload
            localStorage.setItem('menuInfo', JSON.stringify(action.payload))
        },
        clearMenuInfo: (state) => {
            state.menuInfo = null
            localStorage.removeItem('menuInfo')
        },
    },
})

export const {
    setUserInfo,
    clearUserInfo,
    setRoomInfo,
    clearRoomInfo,
    setGameInfo,
    clearGameInfo,
    setMenuInfo,
    clearMenuInfo,
} = authSlice.actions
export default authSlice.reducer
