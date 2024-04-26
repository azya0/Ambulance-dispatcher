import { useEffect, useState } from "react";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';

import config from "../../config";
import StatusesString from "./StatusString";
import StatusesNew from "./StatusNew";

export interface Status {
    id: number,
    name: string,
    used: boolean,
}


function StatusPage() {
    const [statuses, setStatuses] = useState<Array<Status>>();
    const [isAddStatuses, setAddStatuses] = useState(false);

    useEffect(() => {
        axios.get(`${config.url}/call/statuses/full`).then((response) => setStatuses(response.data))
    }, []);

    if (statuses === undefined)
        return null;

    return (
        <>
        <div className="presonal-container">
        <table id="post-table">
            <thead>
            <tr>
                <th>id</th>
                <th>Наименование</th>
                <th>Используется</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                { statuses.map(value => <StatusesString key={value.id} status={value} statuses={statuses} setStatuses={setStatuses}/>) }
                { isAddStatuses && <StatusesNew statuses={statuses} setStatuses={setStatuses} setEnable={setAddStatuses}/> }
            </tbody>
        </table>
        <CSSTransition in={!isAddStatuses} classNames='disappear-animation' timeout={500} unmountOnExit>
            <div>
                <div id='table-footer' onClick={() => setAddStatuses(true)}>добавить новый статус</div>
            </div>
        </CSSTransition>
        </div>
        </>
    );
}

export default StatusPage;
