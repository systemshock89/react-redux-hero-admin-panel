// import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import heroes from '../components/heroesList/heroesSlice'; // slice
// import heroes from '../reducers/heroes';
import filters from '../components/heroesFilters/filtersSlice';
import { apiSlice } from '../api/apiSlice';

// ф-я Middleware возвращает новый dispatch, кот-й что-то делает по-другому
// в store тут только две ф-и из него: dispatch и getState 
// const stringMiddleware = ({dispatch, getState}) => (dispatch) => (action) => {
// const stringMiddleware = (store) => (dispatch) => (action) => {
// в данном случае из store ничего не используется, поэтому можем не передвать ничего:
const stringMiddleware = () => (next) => (action) => {
    if(typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action);
};

// Если передать в dispatch не объект, а строку, то получим ошибку.
// Чтобы все-таки передать туда строку нужно написать свой enhancer- ф-ю, кот-я будет являться усилителем стора.
const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch; // сохраним оригинальный dispatch, кот-й принимал в себя только объект
    store.dispatch = (action) => { // перезаписали оригинальный dispatch

        // написали ф-ю
        // если в dispatch передать строку, то сформируем объект руками (тк dispatch может принимать только объект)
        if(typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action); // если пришла не строка, 
    }
    return store;
}

// более простая и понятная запись благодаря redux toolkit
const store = configureStore({
    reducer: {/*heroes, */
              filters, 
              [apiSlice.reducerPath]: apiSlice.reducer},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware), // в redux toolkit по умолчанию уже есть thunk. 
    // она включена в getDefaultMiddleware. А свой Middleware нужно подключить следующим
    // middleware: [thunk, stringMiddleware],
    devTools: process.env.NODE_ENV !== 'production',
    // preloadedState // необязательный пар-р. задачет начальное знач-е хранилища
    // enhancers // принимает массив
})

// const store = createStore(combineReducers({heroes, filters}), 
//                         compose(applyMiddleware(thunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                        
//                         //  compose(
//                         //     enhancer,
//                         //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                         //  )
//                         );

// const store = createStore(combineReducers({heroes, filters}),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;