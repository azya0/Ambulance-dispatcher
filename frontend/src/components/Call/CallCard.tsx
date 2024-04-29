import axios from "axios";
import { Call } from "./Call";
import config from "../../config";
import { Status } from "../Status/Status";
import { useState } from "react";
import CallPatientField from "./CallPatientField";

interface Prop {
    data: Call,
    statuses: Array<Status>,
    calls: Array<Call>,
    setCalls: (data: Array<Call>) => void,
}


function CallCard({ data, calls, statuses, setCalls }: Prop) {
    const [isSelectStaus, setSelectStatus] = useState(false);

    const update = () => {
        data.updated_at = new Date();
        setCalls([data, ...calls.filter((value) => value.id !== data.id)]);
    }
    const date = (value: Date) => `${new Date(value).toLocaleString([], {timeZone:'Europe/Moscow'})}`;

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
                    setCalls([response.data, ...calls.filter(value => value.id !== response.data.id)])
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
        <div>
            <b>ID: { data.id }</b>
        </div>
        <div className="patient">
            Пациент:
            <CallPatientField id={data.id} field_name="second_name" field_value={data.patient.second_name} update={update}/>
            <CallPatientField id={data.id} field_name="first_name" field_value={data.patient.first_name} update={update}/>
            <CallPatientField id={data.id} field_name="patronymic" field_value={data.patient.patronymic} update={update}/>
        </div>
        <div className="info">
            Адрес:
            <CallPatientField id={data.id} field_name="address" field_value={data.patient.address} update={update}/>
            Описание:
            <CallPatientField id={data.id} field_name="descriptions" field_value={data.patient.descriptions} update={update}/>
            Поступил:
            <b>{ date(data.created_at) }</b>
            Обновлен:
            <b>{ date(data.updated_at) }</b>
            Обслуживается:
            <b>{ data.brigade === null ? "Нет" : "Да" }</b>
        </div>
    </div>
    </>
    )
}

export default CallCard;
