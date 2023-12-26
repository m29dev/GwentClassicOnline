import { apiSlice } from '../redux/apiSlice'

const GAME_URL = '/game'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        gameReadId: builder.mutation({
            query: () => ({
                url: `${GAME_URL}/read/${'id'}`,
                method: 'GET',
            }),
        }),

        gamePlayCard: builder.mutation({
            query: () => ({
                url: `${GAME_URL}/play/card`,
                method: 'GET',
            }),
        }),
    }),
})

export const { useGameReadIdMutation, useGamePlayCardMutation } = authApiSlice
