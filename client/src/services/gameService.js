import { apiSlice } from '../redux/apiSlice'

const GAME_URL = '/game'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE / UPDATE GAME INFO (INIT DATA LIKE FACTION CHOOSING ETC)
        gameInit: builder.mutation({
            query: (data) => ({
                url: `${GAME_URL}/init`,
                method: 'POST',
                body: data,
            }),
        }),

        // READ GAME BY ID
        gameReadId: builder.mutation({
            query: (data) => ({
                url: `${GAME_URL}/${data?.game_id}/${data?.userId}`,
                method: 'GET',
            }),
        }),

        // PLAY A CARD (change later for a socket.io action)
        gamePlayCard: builder.mutation({
            query: () => ({
                url: `${GAME_URL}/play/card`,
                method: 'GET',
            }),
        }),

        // FETCH FACTIONS
        gameFactions: builder.mutation({
            query: () => ({
                url: `${GAME_URL}/factions`,
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGameInitMutation,
    useGameReadIdMutation,
    useGamePlayCardMutation,
    useGameFactionsMutation,
} = authApiSlice
