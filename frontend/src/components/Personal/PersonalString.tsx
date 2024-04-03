import axios from "axios";
import { Person } from "./Personal";
import config from "../../config";
import { useState } from "react";
import PersonalCell from "./PersonalCell";
import PersonalPost from "./PersonalPost";

interface Prop {
    value: Person,
    posts: Map<number, string>,
}

function PersonalString({ value, posts }: Prop) {
    const [data, setData] = useState(value);

    const setIll = () => axios.patch(`${config.url}/personal/worker/${data.id}`, {
        is_ill: !data.is_ill}).then((value) => setData(value.data));

    return (
        <>
        <tr className="personal-string">
            <PersonalCell data={ data.second_name } id={data.id} field="second_name"/>
            <PersonalCell data={ data.first_name } id={data.id} field="first_name"/>
            <PersonalCell data={ data.patronymic } id={data.id} field="patronymic"/>
            <PersonalPost post_id={data.post.id} id={data.id} posts={posts}/>
            <td className={ (data.is_ill ? "color-red" : "color-green") + " table-cell-text" }>
                <b className="ill" onClick={setIll}>{ data.is_ill ? "Болеет" : "Здоров" }</b>
            </td>
        </tr>
        </>
    )
}

export default PersonalString;
