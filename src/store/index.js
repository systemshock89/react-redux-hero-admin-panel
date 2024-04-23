import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

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

const store = createStore(combineReducers({heroes, filters}), 
                        compose(applyMiddleware(thunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                        
                        //  compose(
                        //     enhancer,
                        //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                        //  )
                        );

// const store = createStore(combineReducers({heroes, filters}),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;