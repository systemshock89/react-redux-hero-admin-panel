import { createStore, combineReducers, compose } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';


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
                         compose(
                            enhancer,
                            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                         ));

// const store = createStore(combineReducers({heroes, filters}),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;