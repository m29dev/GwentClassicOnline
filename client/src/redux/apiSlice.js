import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    // baseUrl: 'http://localhost:3000/api',
    baseUrl: 'https://gwentclassicserver.onrender.com/api',
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: () => ({}),
})
