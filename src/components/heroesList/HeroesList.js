// import {useHttp} from '../../hooks/http.hook';
import { /*useEffect,*/ useCallback, useMemo } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
// import { createSelector } from '@reduxjs/toolkit'; // для мемоизации разных значений, кот-е лежат в разных кусочках state

// import { heroDeleted, fetchHeroes, /*filteredHeroesSelector*/ } from './heroesSlice';
import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const baseUrl = process.env.NODE_ENV === 'development'
? 'http://localhost:3001'
: 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

const HeroesList = () => {

    // такой код не оптимизирован и лучше исп-ть createSelector из биб-ки reselect
    // const filteredHeroes = useSelector(state => {
    //     if(state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter)
    //     }
    // })

    const {
        data: heroes = [], // если данные еще не получены, то пустой массив

        // состояния:
        // isFetching, // индикатор повторной загрузки
        isLoading, // индикатор загрузки
        // isSucces,
        isError,
        // error
    } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter);

    const filteredHeroes =  useMemo(() => {
        const filteredHeroes = heroes.slice(); // создаем копию оригинального массива, чтобы избежать мутации

        if(activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter]);


    // const filteredHeroes = useSelector(filteredHeroesSelector);
    // const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    // const dispatch = useDispatch();
    // const {request} = useHttp();

    // useEffect(() => {
    //     dispatch(fetchHeroes()); // request уже не передаем. он есть внутри среза

    //     // dispatch(fetchHeroes(request));

    //     // dispatch(heroesFetching());
    //     // request(`${baseUrl}/heroes`)
    //     //     .then(data => dispatch(heroesFetched(data)))
    //     //     .catch(() => dispatch(heroesFetchingError()))

    //     // eslint-disable-next-line
    // }, []);

    // Функция берет id и по нему удаляет ненужного персонажа из store
    // ТОЛЬКО если запрос на удаление прошел успешно
    // Отслеживайте цепочку действий actions => reducers
    const onDelete = useCallback((id) => {
        // Удаление персонажа по его id
        // request(`${baseUrl}/heroes/${id}`, "DELETE")
        //     .then(data => console.log(data, 'Deleted')) // в дате будет удаленный персонаж
        //     .then(dispatch(heroDeleted(id))) // только когда перс был удален с сервера диспэтчит действие
        //     .catch(err => console.log(err));

        // с помощью RTK Query
        deleteHero(id);
        // eslint-disable-next-line  
    }, []);
    // }, [request]);

    if (isLoading) {
    // if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (isError) {
    // } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;