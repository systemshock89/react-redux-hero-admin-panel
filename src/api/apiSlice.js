import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NODE_ENV === 'development'
? 'http://localhost:3001'
: 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

export const apiSlice = createApi({
    reducerPath: 'api', // название редьюсера

    // fetchBaseQuery - модифицированный fetch
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),

    tagTypes: ['Heroes'], // какие метки существуют в api

    // операции по базовому адресу
    endpoints: builder => ({
        // getHeroes - это endpoint
        getHeroes: builder.query({
            query: () => '/heroes',
            providesTags: ['Heroes'] // когда данные запрашиваются при помощи query, то к какой метке это относится
        }),

        // мутация - добавление героя
        createHero: builder.mutation({
            query: hero => ({
                url: '/heroes',
                method: 'POST',
                body: hero // body будет автоматически превращен в json-формат
            }),
            invalidatesTags: ['Heroes'] // если мутировали данные, то по какой метке должны получить эти данные
        }),

        deleteHero: builder.mutation({
            query: id => ({
                url: `/heroes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Heroes']
        })
    })
});

export const {useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation} = apiSlice;