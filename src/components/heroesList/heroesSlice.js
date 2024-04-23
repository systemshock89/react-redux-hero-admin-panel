import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const initialState = {
    heroes: [], // список героев, полученных с сервера
    heroesLoadingStatus: 'idle', // idle - бездействие
}

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
            state.heroes.push(action.payload);
            // этот код визуально не подходит под понятие иммутабельности
            // но биб-ка immer.js, встроенная в redux toolkit будет соблюдать иммутабельность
            // Эта ф-я не должна ничего возвращать! return тут писать нельзя! иначе immer.js работать не будет)
        },
        heroDeleted: (state, action) => {
            state.heroes.filter(item => item.id !== action.payload);
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
                state.heroes = action.payload;
            }) // какое действие будет выполнено, когда запрос выполнился успешно
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            }) //какое действие будет выполнено, когда произошла ошибка
            .addDefaultCase(() => {})
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