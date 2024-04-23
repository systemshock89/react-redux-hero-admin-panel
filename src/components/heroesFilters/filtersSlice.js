import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const filtersAdapter =  createEntityAdapter();

// const initialState = {
//     filters: [],
//     activeFilter: 'all'
// }

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all', 
});

const baseUrl = process.env.NODE_ENV === 'development'
? 'http://localhost:3001'
: 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp();
        return await request(`${baseUrl}/filters`);
    }
);

const filtersSlice = createSlice({
    name: 'filters', // пространство имен
    initialState,
    reducers: {
        filtersChanged: (state, action) => {
            state.activeFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'}) 
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            }) 
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error';
            }) 
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);
// export const getFilters = selectAll(store.getState()); // так работать не будет, тк если ипортировать сюда стор до того, как он был создан, то получим undefined

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    filtersChanged
} = actions;