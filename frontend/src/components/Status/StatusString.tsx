import axios from "axios";
import { Status } from "./Status";
import PostCell from "./StatusCell";
import config from "../../config";


interface Prop {
    status: Status,
    statuses: Array<Status>,
    setStatuses: (data: Array<Status>) => void,
}


function StatusString({ status, statuses, setStatuses }: Prop) {
    return (
        <>
        <tr className="personal-string post-string">
            <td><b>{ status.id }</b></td>
            <PostCell status={status}/>
            <td className={ (status.used ? "color-green" : "") + " table-cell-text" }>
                <b>{ status.used ? "Да" : "Нет" }</b>
            </td>
            <td onClick={() => {
                axios.delete(`${config.url}/call/status/${status.id}`).then(() => {
                    setStatuses(statuses.filter((value) => value.id !== status.id));
                }).catch(error => {
                    if (error.response.status === 409)
                        alert(`Статус используется!`);
                })
            }}><b>╳</b></td>
        </tr>
        </>
    );
}

export default StatusString;
