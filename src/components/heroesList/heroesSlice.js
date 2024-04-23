import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    heroes: [], // список героев, полученных с сервера
    heroesLoadingStatus: 'idle', // idle - бездействие
}

const heroesSlice = createSlice({
    name: 'heroes', // пространство имен
    initialState,
    reducers: {
        heroesFetching: state => {state.heroesLoadingStatus = 'loading'},
        // этот код визуально не подходит под понятие иммутабельности
        // но биб-ка immer.js, встроенная в redux toolkit будет соблюдать иммутабельность
        // Эта ф-я не должна ничего возвращать! return тут писать нельзя! иначе immer.js работать не будет)

        heroesFetched: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        heroesFetchingError: state => {
            state.heroesLoadingStatus = 'error';
        },
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes.filter(item => item.id !== action.payload);
        },

    }
});

const {actions, reducer} = heroesSlice;

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;