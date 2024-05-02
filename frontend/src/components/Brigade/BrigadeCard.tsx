import axios from "axios";
import { CallShort } from "../Call/Call";
import { Person } from "../Personal/Personal";
import { Brigade } from "./Brigade";
import config from "../../config";
import { useState } from "react";
import { CarShort } from "../Cars/Cars";


interface Prop {
    data: Brigade,
    workers: Array<Person>,
    setWorkers: (data: Array<Person>) => void,
    calls: Array<CallShort>,
    setCalls: (data: Array<CallShort>) => void,
    cars: Array<CarShort>,
    setCars: (data: Array<CarShort>) => void,
    brigades: Array<Brigade>,
    setBrigades: (data: Array<Brigade>) => void,
}


function BrigadeCard({ data, workers, setWorkers, calls, setCalls, cars, setCars, brigades, setBrigades }: Prop) {
    const [brigade, setBrigade] = useState(data);
    const [isAddWorker, setAddWorker] = useState(false);

    if (brigade === undefined)
        return null;

    const date = (value: Date) => `${new Date(value).toLocaleTimeString([], {timeZone:'Europe/Moscow'})}`;
    let call_list = calls.map(value => <option key={value.id} value={value.id}>ID: {value.id}</option>);
    const missing = <option key={-1} value={-1}>Отсутствует</option>;

    if (brigade.call === null)
        call_list = [missing, ...call_list];
    else
        call_list = [<option key={brigade.call.id} value={brigade.call.id}>ID: {brigade.call.id}</option>, ...call_list, missing]

    let cars_list = cars.map(value => <option key={value.id} value={value.id}>ID: {value.id} | {value.model}</option>);
    
    if (brigade.car === null)
        cars_list = [missing, ...cars_list];
    else
        cars_list = [<option key={brigade.car.id} value={brigade.car.id}>ID: {brigade.car.id} | {brigade.car.model}</option>, ...cars_list]

    return (
    <>
    <div className="brigade-container">
        <b className='cross' onClick={() => {
            axios.delete(`${config.url}/brigade/by_id/${brigade.id}`).then(() => {
                setBrigades(brigades.filter(val => val.id !== brigade.id));
            });
        }}>╳</b>
        <h4>ID: { brigade.id }</h4>
        <div className="brigade-call">
            <b>Вызов</b>
            <select onChange={event => {
                let value = event.target.value;

                axios.patch(`${config.url}/brigade/by_id/${brigade.id}`, {call_id: value}).then(response => {
                    let new_calls = calls.filter(val => val.id !== Number(value));

                    if (brigade.call !== null)
                        new_calls.push(brigade.call);

                    setCalls(new_calls);
                    setBrigade(response.data);
                });
            }}>
                { call_list }
            </select>
        </div>
        <h4>Персонал:</h4>
        <div className="brigade-workers">
            { brigade.workers.map(value => 
            <div className="worker-container" key={value.id} onDoubleClick={() => {
                const response_data = brigade.workers.filter(val => val.id !== value.id).map(val => val.id);
                axios.patch(`${config.url}/brigade/by_id/${brigade.id}`, {workers: response_data}).then(response => {
                    setBrigade(response.data);
                    setWorkers([...workers, value]);
                }).catch(error => {
                    if (error.response.status === 400)
                        alert(error.response.data.detail);
                });
            }}>
            <b>{ value.second_name } { value.first_name } { value.patronymic }</b>
            <b>{ value.post.is_driver ? "Водитель" : value.post.name }</b>
            </div>
            ) }
            {
                !isAddWorker ?
                <b className="brigade-workers-add" onClick={() => setAddWorker(true)}>+</b> :
                <select autoFocus={true} onBlur={() => setAddWorker(false)} onChange={event => {
                    let response_data = brigade.workers.map(val => val.id);
                    response_data.push(Number(event.target.value));

                    axios.patch(`${config.url}/brigade/by_id/${brigade.id}`, {workers: response_data}).then(response => {
                        setBrigade(response.data);
                        setWorkers(workers.filter(val => val.id !== Number(event.target.value)));
                    }).catch(error => {
                        if (error.response.status === 400)
                            alert(error.response.data.detail);
                    });
                }}>
                    <option value={-1} key={-1}>Выберете рабочего</option>
                {
                    workers.map(value => <option key={value.id} value={value.id}>ID: { value.id } | { value.second_name } { value.first_name } { value.patronymic }</option>)
                }
                </select>
            }
        </div>
        <div className="brigade-car-info">
            <b>Автомобиль:</b>
            <select onChange={event => {
                let value = event.target.value;

                axios.patch(`${config.url}/brigade/by_id/${brigade.id}`, { car: value }).then(response => {
                    setBrigade(response.data);
                    
                    const new_cars = cars.filter(val => val.id !== Number(value));

                    if (brigade.car !== null)
                        new_cars.push(brigade.car)

                    setCars(new_cars);
                });
            }}>
                {
                    cars_list
                }
            </select>
        </div>
        <div className="brigade-time">
            <div>
                <b>Работает с:</b>
                <input type="time" defaultValue={ date(brigade.start_time).slice(0, -3) }/>
            </div>
            <div>
                <b>Работает до:</b>
                <input type="time" defaultValue={ date(brigade.end_time).slice(0, -3) }/>
            </div>
        </div>
    </div>
    </>
    );
}

export default BrigadeCard;
