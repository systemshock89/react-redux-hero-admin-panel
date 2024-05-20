

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import {useHttp} from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import store from '../../store';

import { selectAll } from '../heroesFilters/filtersSlice';
// import { heroCreated } from '../heroesList/heroesSlice';
import { useCreateHeroMutation } from '../../api/apiSlice';

const HeroesAddForm = () => {
    // Состояния для контроля формы
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const [createHero, {isLoading}] = useCreateHeroMutation();

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());  // если передать selectAll без аргументов, то будет ошибка, тк selectAll не знает о глобальном state
    // const dispatch = useDispatch();
    // const {request} = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        // Можно сделать и одинаковые названия состояний,
        // хотел показать вам чуть нагляднее
        // Генерация id через библиотеку
        const newHero = {
            id: nanoid(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        // Отправляем данные на сервер в формате JSON
        // ТОЛЬКО если запрос успешен - отправляем персонажа в store

        // const baseUrl = process.env.NODE_ENV === 'development'
        // ? 'http://localhost:3001'
        // : 'https://my-json-server.typicode.com/systemshock89/react-redux-hero-admin-panel';

        // request(`${baseUrl}/heroes`, "POST", JSON.stringify(newHero))
        //     .then(res => console.log(res, 'Отправка успешна'))
        //     .then(dispatch(heroCreated(newHero)))
        //     .catch(err => console.log(err));

        // с помощью RTK Query
        createHero(newHero).unwrap();

        // Очищаем форму после отправки
        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        // Если фильтры есть, то рендерим их
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;