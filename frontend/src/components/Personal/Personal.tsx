import { useEffect, useState } from 'react';
import axios from "axios";

import PersonalString from './PersonalString';
import config from "../../config";


export interface Person {
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
    const [personal, setPersonal] = useState<Array<Person>>();
    const [posts, setPosts] = useState<Map<number, string>>();

    useEffect(() => {
        axios.get(`${config.url}/personal/workers`).then((value) =>
            setPersonal(value.data.sort((person1: Person, person2: Person) =>
            person1.second_name > person2.second_name ? 1 : -1)));
        axios.get(`${config.url}/personal/posts`).then((value) => {
            setPosts(new Map(value.data.map((element: {id: number, name: string}) => [element.id, element.name])));
        });
    }, []);

    if (personal === undefined || posts === undefined)
        return null;

    return (
        <>
        <div className='presonal-container'>
            <table>
                <thead>
                <tr>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Должность</th>
                    <th>Здоровье</th>
                </tr>
                </thead>
                <tbody>
                {
                    personal.map((value) => <PersonalString key={value.id} value={value} posts={posts}/>)
                }
                </tbody>
                {/* <tfoot>
                    <tr>
                        <td className='table-cell-text' colSpan={5}>+</td>
                    </tr>
                </tfoot> */}
            </table>
        </div>
        </>
    )
}

export default Personal;
