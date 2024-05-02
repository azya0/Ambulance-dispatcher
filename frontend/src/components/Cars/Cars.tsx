import { useEffect, useState } from "react";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';

import config from "../../config";
import CarsString from "./CarsString";
import CarsNew from "./CarsNew";


export interface CarShort {
    id: number,
    model: string,
}


export interface Car {
    id: number,
    model: string,
    used: boolean,
}


function CarsPage() {
    const [cars, setCars] = useState<Array<Car>>();
    const [isAddCars, setAddCars] = useState(false);

    useEffect(() => {
        axios.get(`${config.url}/car/full/all`).then((response) => setCars(response.data))
    }, []);

    if (cars === undefined)
        return null;

    return (
        <>
        <div className="presonal-container">
        <table id="post-table">
            <thead>
            <tr>
                <th>id</th>
                <th>Модель</th>
                <th>Используется</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                { cars.map(value => <CarsString key={value.id} car={value} cars={cars} setCars={setCars}/>) }
                { isAddCars && <CarsNew cars={cars} setCars={setCars} setEnable={setAddCars}/> }
            </tbody>
        </table>
        <CSSTransition in={!isAddCars} classNames='disappear-animation' timeout={500} unmountOnExit>
            <div>
                <div id='table-footer' onClick={() => setAddCars(true)}>добавить новую машину</div>
            </div>
        </CSSTransition>
        </div>
        </>
    );
}

export default CarsPage;
