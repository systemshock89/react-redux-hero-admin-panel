// после добавления комплексных (с помощью createAsyncThunk) и простых action creatos в срез эти экшены не используются

// import { createAction } from "@reduxjs/toolkit";
import {heroesFetching, heroesFetched, heroesFetchingError} from '../components/heroesList/heroesSlice';
import {filtersFetching, filtersFetched, filtersFetchingError} from '../components/heroesFilters/filtersSlice';

const baseUrl = process.env.NODE_ENV === 'development'
? 'http://localhost:3001'
: 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

// благодаря middleware ReduxThunk можем передать в action ф-ю, которая сократит повторяющийся код
// получили комплексный action creator
export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request(`${baseUrl}/heroes`)
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
        request(`${baseUrl}/filters`)
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))
}

// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }

// export const heroesFetching = createAction('HEROES_FETCHING');

// export const heroesFetched = (heroes) => {
//     return {
//         type: 'HEROES_FETCHED',
//         payload: heroes
//     }
// }

// аргумент, кот-й приходит в createAction (в нашем случае heroes) автоматически переходит в поле с названием payload
// но если добавить доп-е аргументы в вызов action creator'а, то они не уже будут передаваться
// например, в .then(data => dispatch(heroesFetched(data, 'test'))) строка test не передасться
// export const heroesFetched = createAction('HEROES_FETCHED');

// export const heroesFetchingError = createAction('HEROES_FETCHING_ERROR');
// export const heroesFetchingError = () => {
//     return {
//         type: 'HEROES_FETCHING_ERROR'
//     }
// }


// export const filtersFetching = () => {
//     return {
//         type: 'FILTERS_FETCHING'
//     }
// }

// export const filtersFetched = (filters) => {
//     return {
//         type: 'FILTERS_FETCHED',
//         payload: filters
//     }
// }

// export const filtersFetchingError = () => {
//     return {
//         type: 'FILTERS_FETCHING_ERROR'
//     }
// }


// export const activeFilterChanged = (filter) => {
//     return {
//         type: 'ACTIVE_FILTER_CHANGED',
//         payload: filter
//     }
// }

// тк подключен middleware ReduxThunk, то можем передать не только объект, но и ф-ю
// export const activeFilterChanged = (filter) => (dispatch) => {
//     // возвратим ф-ю, кот-я через 1 сек будет изменять фильтр
//     setTimeout(() => {
//         dispatch({
//             type: 'ACTIVE_FILTER_CHANGED',
//             payload: filter
//         })
//     }, 1000)
// }

// export const heroCreated = createAction('HERO_CREATED');
// export const heroCreated = (hero) => {
//     return {
//         type: 'HERO_CREATED',
//         payload: hero
//     }
// }

// export const heroDeleted = createAction('HERO_DELETED');
// export const heroDeleted = (id) => {
//     return {
//         type: 'HERO_DELETED',
//         payload: id
//     }
// }