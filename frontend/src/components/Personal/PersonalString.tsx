import axios from "axios";
import { Person } from "./Personal";
import config from "../../config";
import { useState } from "react";
import PersonalCell from "./PersonalCell";
import PersonalPost from "./PersonalPost";

interface Prop {
    currentId: number,
    workers: Array<Person>;
    setWorkers: (data: Array<Person>) => void;
    posts: Map<number, string>,
}

function PersonalString({ currentId, workers, setWorkers, posts }: Prop) {
    const [data, setData] = useState(workers[currentId]);

    const setIll = () => axios.patch(`${config.url}/personal/worker/${data.id}`, {
        is_ill: !data.is_ill}).then((value) => setData(value.data));

    return (
        <>
        <tr className="personal-string">
            <PersonalCell data={ data.second_name } id={data.id.toString()} field="second_name"/>
            <PersonalCell data={ data.first_name } id={data.id.toString()} field="first_name"/>
            <PersonalCell data={ data.patronymic } id={data.id.toString()} field="patronymic"/>
            <PersonalPost post_id={data.post.id} id={data.id.toString()} posts={posts}/>
            <td className={ (data.is_ill ? "color-red" : "color-green") + " table-cell-text" }>
                <b className="ill" onClick={setIll}>{ data.is_ill ? "Болеет" : "Здоров" }</b>
            </td>
            <td><div>
            <b className='cross' onClick={() => {
                axios.delete(`${config.url}/personal/worker/${data.id}`).then(() => {
                    setWorkers(workers.filter((value) => value.id !== data.id));
                });
            }}>╳</b>
                </div></td>
        </tr>
        </>
    )
}

export default PersonalString;
