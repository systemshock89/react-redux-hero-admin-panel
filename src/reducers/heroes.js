import { createReducer } from "@reduxjs/toolkit";

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from '../actions';

const initialState = {
    heroes: [], // список героев, полученных с сервера
    heroesLoadingStatus: 'idle', // idle - бездействие
}

// это вар-т работает только в js, а не в ts
const heroes = createReducer(initialState, {
        [heroesFetching]: state => {state.heroesLoadingStatus = 'loading'},
        // этот код визуально не подходит под понятие иммутабельности
        // но биб-ка immer.js, встроенная в redux toolkit будет соблюдать иммутабельность
        // Эта ф-я не должна ничего возвращать! return тут писать нельзя! иначе immer.js работать не будет)

        [heroesFetched]: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        [heroesFetchingError]: state => {
            state.heroesLoadingStatus = 'error';
        },
        [heroCreated]: (state, action) => {
            state.heroes.push(action.payload);
        },
        [heroDeleted]: (state, action) => {
            state.heroes.filter(item => item.id !== action.payload);
        },
    },
    [], //  массив ф-й сравнения
    state => state // Default
)

// const heroes = createReducer(initialState, builder => {
//     builder
//         .addCase(heroesFetching, state => {
//             state.heroesLoadingStatus = 'loading';
//             // этот код визуально не подходит под понятие иммутабельности
//             // но биб-ка immer.js, встроенная в redux toolkit будет соблюдать иммутабельность
//             // Эта ф-я не должна ничего возвращать! return тут писать нельзя! иначе immer.js работать не будет)
//         })
//         .addCase(heroesFetched, (state, action) => {
//             state.heroesLoadingStatus = 'idle';
//             state.heroes = action.payload;
//         })
//         .addCase(heroesFetchingError, state => {
//             state.heroesLoadingStatus = 'error';
//         })
//         .addCase(heroCreated, (state, action) => {
//             state.heroes.push(action.payload);
//         })
//         .addCase(heroDeleted, (state, action) => {
//             state.heroes.filter(item => item.id !== action.payload);
//         })
//         .addDefaultCase(() => {}) // пишут пустую ф-ю, тк state окажется таким же
// })

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':  
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED': // получили
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             } 
//         case 'HERO_CREATED':
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload]
//             }            
//         case 'HERO_DELETED': 
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(item => item.id !== action.payload)
//             }            
//         default: return state
//     }
// }

export default heroes;