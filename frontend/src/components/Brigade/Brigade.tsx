import axios from "axios";
import { useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import config from "../../config";
import { Person } from "../Personal/Personal";
import { CallShort } from "../Call/Call";


interface Brigade {
    id: number,
    car: {
        id: number,
        model: string,
    }
    workers: Array<Person>,
    call: CallShort,
}


function BrigadePage() {
    const [brigades, setBrigades] = useState<Brigade>();
    const [isAddBrigade, setAddBrigade] = useState(false);
    
    useEffect(() => {
        axios.get(`${config.url}/brigade/all`).then((response) => {
            setBrigades(response.data);
        });
    }, []);

    if (brigades === undefined)
        return null;

    console.log(brigades);

    return (
        <>
        {/* <CSSTransition in={isAddBrigade} classNames='disappear-animation' timeout={500} unmountOnExit>
        <div id='add-call'>
            <b className='cross' onClick={() => setAddBrigade(false)}>╳</b>
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
                    return;
                }).catch((error) => console.log(error));

                setAddBrigade(false);
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
        </CSSTransition> */}
        </>
    );
}

export default BrigadePage;
