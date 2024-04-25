import axios from "axios";
import { Call } from "./Call";
import config from "../../config";
import { Status } from "../Status/Status";
import { useState } from "react";

interface Prop {
    data: Call,
    statuses: Array<Status>,
    calls: Array<Call>,
    setCalls: (data: Array<Call>) => void,
}


function CallCard({ data, calls, statuses, setCalls }: Prop) {
    const [isSelectStaus, setSelectStatus] = useState(false);
    
    return (
    <>
    <div className="call-card">
        <b className='cross' onClick={() => {
            axios.delete(`${config.url}/call/call/close/${data.id}`).then(() => {
                setCalls(calls.filter(value => value.id !== data.id))
            });
        }}>╳</b>
        <div className="call-status" onDoubleClick={() => setSelectStatus(true)}>
            {
            (isSelectStaus) ?
            <select onChange={(event) => {
                let value = event.target.value;

                axios.patch(`${config.url}/call/call/${data.id}`, {
                    status_id: value, 
                }).then((response) => {
                    setCalls([response.data, ...calls.filter(value => value.id != response.data.id)])
                    setSelectStatus(false)
                }
            )}} autoFocus={true} onBlur={() => setSelectStatus(false)}>
                <option value={data.status.id} key={-1}>{ data.status.name }</option>
                {
                    statuses.filter(value => value.id !== data.status.id).map((value, index) => 
                        <option value={value.id} key={index}>{ value.name }</option>)
                }
            </select>
            : <b>{ data.status.name }</b>
            }
        </div>
        <div className="patient">
            Пациент:
            <b>{ data.patient.second_name }</b>
            <b>{ data.patient.first_name }</b>
            <b>{ data.patient.patronymic }</b>
        </div>
        <div className="info">
            Адрес:
            <b>{ data.patient.address }</b>
            Описание:
            <b>{ data.patient.descriptions }</b>
            Обслуживается:
            <b>{ data.brigade === null ? "Нет" : "Да" }</b>
        </div>
    </div>
    </>
    )
}

export default CallCard;
