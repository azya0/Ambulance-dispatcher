import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import CallCard from "./CallCard";
import { CSSTransition } from 'react-transition-group';
import { Status } from "../Status/Status";


export interface CallShort {
    id: number,
    status: {
        id: number,
        name: string,
    },

    patient: {
        id: number,
        address: string,
        descriptions: string,

        first_name: string,
        second_name: string,
        patronymic: string | null,
    },

    created_at: Date,
    updated_at: Date,
    end_at: Date,
}


export interface Call {
    id: number,
    status: {
        id: number,
        name: string,
    },

    patient: {
        id: number,
        address: string,
        descriptions: string,

        first_name: string,
        second_name: string,
        patronymic: string | null,
    },

    brigade: {
        id: number,
    } | null,

    is_system_closed: boolean,

    created_at: Date,
    updated_at: Date,
    end_at: Date,
}


function CallPage() {
    const [calls, setCalls] = useState<Array<Call>>();
    const [statuses, setStatuses] = useState<Array<Status>>();
    const [isAddCall, setAddCall] = useState(false);

    useEffect(() => {
        axios.get(`${config.url}/call/calls`).then(response =>
            setCalls(response.data.sort((value1: Call, value2: Call) => value1.updated_at <= value2.updated_at ? 1 : -1))
        );
        
        axios.get(`${config.url}/call/statuses`).then(response => setStatuses(response.data));
    }, []);

    if (calls === undefined || statuses === undefined)
        return null;
    
    return (
        <>
        <CSSTransition in={isAddCall} classNames='disappear-animation' timeout={500} unmountOnExit>
        <div id='add-call'>
            <b className='cross' onClick={() => setAddCall(false)}>╳</b>
            <form onSubmit={(data: React.FormEvent<HTMLFormElement>) => {
                let uploadData = Object.values(data.target);

                axios.post(`${config.url}/call/call`, {
                    patient: {
                        first_name: uploadData[0].value,
                        second_name: uploadData[1].value,
                        patronymic: uploadData[2].value,
                        address: uploadData[3].value,
                        descriptions: uploadData[4].value,
                    },

                    status: {
                        id: uploadData[5].value,
                        name: uploadData[5].options[uploadData[5].selectedIndex].text,
                    },
                }).then((response) => {
                    if (response.status !== 200) {
                        console.log(response);
                        return;
                    }

                    setCalls([response.data, ...calls].sort(
                        (value1: Call, value2: Call) => value1.updated_at > value2.updated_at ? 1 : -1));
                }).catch((error) => console.log(error));
                setAddCall(false);
                data.preventDefault();
            }}>
                <div>
                    <h1>Пациент:</h1>
                    <h2>Фамилия</h2>
                    <input type='first-name'/>
                    <h2>Имя</h2>
                    <input type='second-name'/>
                    <h2>Отчество</h2>
                    <input type='patronymic'/>
                    <h2>Адрес</h2>
                    <input type='address'/>
                    <h2>Описание</h2>
                    <input type='patronymic'/>
                    <h1>Статус</h1>
                    <select name="status">
                        <option value="-1" key={-1}>Выберете статус</option>
                        { statuses.map((value, index) => <option value={value.id} key={index}>{value.name}</option>) }
                    </select>
                </div>
                <div>
                    <button>Создать</button>
                </div>
            </form>
        </div>
        </CSSTransition>
        <div id="call-main-container" className={isAddCall ? "background-disabled" : ""}>
            <div>
                <div id='table-footer' onClick={() => setAddCall(true)}>Поступил новый вызов!</div>
            </div>
            <div id='call-container'>
                { calls.map(value => <CallCard key={value.id} data={value} statuses={statuses} calls={calls} setCalls={setCalls}/>) }
            </div>
        </div>
        </>
    )
}

export default CallPage;
