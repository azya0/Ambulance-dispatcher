import { useEffect, useState } from 'react';
import axios from "axios";

import PersonalString from "./PersonalString";
import config from "../config";


interface Person {
    id: string,
    first_name: string,
    second_name: string,
    patronymic: string,
    is_ill: boolean,
    post: {
        id: number,
        name: string,
    }
}


function Personal() {
    const [personal, setPersonal] = useState(Array<Person>);

    useEffect(() => {
        axios.get(`${config.url}/personal/workers`).then((value) => {
            setPersonal(value.data);
        });
    }, []);

    return (
        <>
        <div className='presonal-container'>
            <table>
            <tr>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Должность</th>
                <th>Здоровье</th>
            </tr>
            {
            personal.map((value) => <PersonalString key={value.id} first_name={value.first_name} second_name={
                value.second_name} patronymic={value.patronymic} is_ill={value.is_ill} post={value.post.name} />)
            }
            </table>
        </div>
        </>
    )
}

export default Personal;
