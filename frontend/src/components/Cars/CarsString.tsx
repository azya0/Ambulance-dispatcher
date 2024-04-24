import axios from "axios";
import { Car } from "./Cars";
import PostCell from "./CarsCell";
import config from "../../config";

interface Prop {
    car: Car,
    cars: Array<Car>,
    setCars: (data: Array<Car>) => void,
}

function CarString({ car, cars, setCars }: Prop) {
    return (
        <>
        <tr className="personal-string post-string">
            <td><b>{ car.id }</b></td>
            <PostCell car={car}/>
            <td className={ (car.used ? "color-green" : "") + " table-cell-text" }>
                <b>{ car.used ? "Да" : "Нет" }</b>
            </td>
            <td onClick={() => {
                axios.delete(`${config.url}/car/get_by_id/${car.id}`).then(() => {
                    setCars(cars.filter((value) => value.id !== car.id));
                }).catch(error => {
                    if (error.response.status === 409)
                        alert(`Автомобиль используется!`);
                })
            }}><b>╳</b></td>
        </tr>
        </>
    );
}

export default CarString;
