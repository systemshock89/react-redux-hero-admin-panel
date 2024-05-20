// Весь ф-ционал не нужен, если используется подход с RTK Query

import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter =  createEntityAdapter();

// const initialState = {
//     heroes: [], // список героев, полученных с сервера
//     heroesLoadingStatus: 'idle', // idle - бездействие
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle', // idle - бездействие
});

const baseUrl = process.env.NODE_ENV === 'development'
? 'http://localhost:3001'
: 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    // ф-я кот-я должна вернуть промис
    // можно и сихнронный код, но вручную прописать ошибку
    async () => {

        // 1-й арг: то, что приходит при dispatch действия
        // в данном случае ничего не передаем

        //2-й арг: thunkAPI

        const {request} = useHttp();
        return await request(`${baseUrl}/heroes`);
        // async, await для данного хука useHttp не обязательно, тк хук возвращает промис
    }
);

const heroesSlice = createSlice({
    name: 'heroes', // пространство имен
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            heroesAdapter.addOne(state, action.payload);

            // state.heroes.push(action.payload);
            // этот код визуально не подходит под понятие иммутабельности
            // но биб-ка immer.js, встроенная в redux toolkit будет соблюдать иммутабельность
            // Эта ф-я не должна ничего возвращать! return тут писать нельзя! иначе immer.js работать не будет)
        },
        heroDeleted: (state, action) => {
            heroesAdapter.removeOne(state, action.payload);
            // state.heroes = state.heroes.filter(item => item.id !== action.payload);
        },

    },
    // тк эти action creators создаются вне слайса, то они считаются сторонними
    // поэтому они не записываются в обычные reducers
    // они записываются в extra reducers (дополнительные)
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'}) // какое действие будет выполнено, когда отправляем запрос на сервер
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                heroesAdapter.setAll(state, action.payload) // во время того как запрос выполнился, получили данные, воспользуемся командой setAll,
                // кот-я возьмет кусочек state с героями и добавит в них все что пришло от сервера
                // эта команда возьмет то что было изначально и ЗАМЕНИТ тем что пришло от сервера
                // (если нужно добавить новые значения и не стирать старые - то команда setMany)

                // state.heroes = action.payload;
            }) // какое действие будет выполнено, когда запрос выполнился успешно
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            }) //какое действие будет выполнено, когда произошла ошибка
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes); // селекторы привязаны к героям

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll, // в эту ф-ю state передасться автоматически
    // (state) => state.heroes.heroes,
    (filter, heroes) => {
        if(filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
);

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;