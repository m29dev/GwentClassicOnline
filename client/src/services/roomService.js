import { apiSlice } from '../redux/apiSlice'

const ROOM_URL = '/rooms'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        roomCreate: builder.mutation({
            query: (data) => ({
                url: `${ROOM_URL}/create`,
                method: 'POST',
                body: data,
            }),
        }),

        roomRead: builder.mutation({
            query: (data) => ({
                url: `${ROOM_URL}/read/${data?.roomInfoId}/${data?.userInfoId}`,
                method: 'GET',
            }),
        }),

        // roomUserJoin: builder.mutation({
        //     query: (data) => ({
        //         url: `${ROOM_URL}/user/join`,
        //         method: 'POST',
        //         body: data,
        //     }),
        // }),

        // saveGameData: builder.mutation({
        //     query: (data) => ({
        //         url: `${ROOM_URL}/data/save`,
        //         method: 'POST',
        //         body: data,
        //     }),
        // }),

        // getGameData: builder.mutation({
        //     query: (roomId) => ({
        //         url: `${ROOM_URL}/data/get/${roomId}`,
        //         method: 'GET',
        //     }),
        // }),
    }),
})

export const {
    useRoomCreateMutation,
    useRoomReadMutation,
    // useRoomUserJoinMutation,
    // useSaveGameDataMutation,
    // useGetGameDataMutation,
} = authApiSlice
