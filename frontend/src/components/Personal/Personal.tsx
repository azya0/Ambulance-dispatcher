import { useEffect, useState } from 'react';
import axios from "axios";
import { CSSTransition } from 'react-transition-group';

import PersonalString from './PersonalString';
import config from "../../config";
import { Post } from '../Post/Post';


export interface Person {
    id: number,
    first_name: string,
    second_name: string,
    patronymic: string,
    is_ill: boolean,
    post: Post,
}


function Personal() {
    const [personal, setPersonal] = useState<Array<Person>>();
    const [posts, setPosts] = useState<Map<number, string>>();
    const [isAddWorker, setAddWorker] = useState(false);

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
        <CSSTransition in={isAddWorker} classNames='disappear-animation' timeout={500} unmountOnExit>
        <div id='add-worker'>
            <b className='cross' onClick={() => setAddWorker(false)}>╳</b>
            <form onSubmit={(data: React.FormEvent<HTMLFormElement>) => {
                let uploadData = Object.values(data.target);
                
                axios.post(`${config.url}/personal/worker`, {
                    first_name: uploadData[1].value,
                    second_name: uploadData[0].value,
                    patronymic: uploadData[2].value,
                    post_id: uploadData[3].value,
                }).then((response) => {
                    if (response.status !== 200) {
                        console.log(response);
                        return;
                    }

                    setPersonal([...personal, response.data].sort(
                        (person1: Person, person2: Person) =>
                    person1.second_name > person2.second_name ? 1 : -1));
                }).catch((error) => console.log(error));

                setAddWorker(false);

                data.preventDefault();
            }}>
                <div>
                    <h1>Фамилия</h1>
                    <input type='first-name'/>
                    <h1>Имя</h1>
                    <input type='second-name'/>
                    <h1>Отчество</h1>
                    <input type='patronymic'/>
                    <h1>Должность</h1>
                    <select name="posts">
                        <option value="-1" key={-1}>Выберете должность</option>
                        { Array.from(posts).map(([key, value]) => <option value={key} key={key}> {value} </option>) }
                    </select>
                </div>
                <div>
                    <button>Создать</button>
                </div>
            </form>
        </div>
        </CSSTransition>
        <div className={"presonal-container" + (isAddWorker ? " background-disabled" : "")}>
            <table>
                <thead>
                <tr>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Должность</th>
                    <th>Здоровье</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    personal.map((value, index) => <PersonalString key={value.id} currentId={index} workers={personal} setWorkers={setPersonal} posts={posts}/>)
                }
                </tbody>
            </table>
            <CSSTransition in={!isAddWorker} classNames='disappear-animation' timeout={500} unmountOnExit>
            <div>
                <div id='table-footer' onClick={() => setAddWorker(true)}>добавить нового работника</div>
            </div>
            </CSSTransition>
        </div>
        </>
    )
}

export default Personal;
