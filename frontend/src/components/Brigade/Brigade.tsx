import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import { Person } from "../Personal/Personal";
import { CallShort } from "../Call/Call";
import BrigadeCard from "./BrigadeCard";
import { CarShort } from "../Cars/Cars";


export interface Brigade {
    id: number,
    rating: number,

    car: {
        id: number,
        model: string,
    } | null,
    workers: Array<Person>,
    call: CallShort | null,

    start_time: Date,
    end_time: Date,
}


function BrigadePage() {
    const [brigades, setBrigades] = useState<Array<Brigade>>();
    const [calls, setCalls] = useState<Array<CallShort>>();
    const [workers, setWorkers] = useState<Array<Person>>();
    const [cars, setCars] = useState<Array<CarShort>>();
    
    useEffect(() => {
        axios.get(`${config.url}/brigade/all`).then(response => {
            setBrigades(response.data.sort((brigade1: Brigade, brigade2: Brigade) => brigade1.id > brigade2.id ? 1 : -1));
        });

        axios.get(`${config.url}/personal/workers/free`).then(response => {
            setWorkers(response.data);
        });

        axios.get(`${config.url}/call/calls/free`).then(response => {
            setCalls(response.data);
        });

        axios.get(`${config.url}/car/free`).then(response => {
            setCars(response.data);
        });
    }, []);

    if (brigades === undefined || calls === undefined || workers === undefined || cars === undefined)
        return null;

    return (
        <>
        <div>
            <div id='brigade-container-btn'>
                <div id='table-footer' onClick={() => {
                    axios.post(`${config.url}/brigade`).then(response => {
                        setBrigades([...brigades, response.data]);
                    })
                }}>Добавить новую бригаду</div>
            </div>
            <div id='brigade-containter'>
                { brigades.map(value => <BrigadeCard key={value.id} calls={calls} setCalls={setCalls} workers={workers}
                setWorkers={setWorkers} data={value} cars={cars} setCars={setCars} brigades={brigades} setBrigades={setBrigades}/>) }
            </div>
        </div>
        </>
    );
}

export default BrigadePage;
