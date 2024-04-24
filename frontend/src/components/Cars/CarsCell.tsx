import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../../config";
import { Car } from "./Cars";


interface Prop {
    car: Car
}


function CarCell({ car }: Prop) {
    const [value, setValue] = useState(car.model);
    const [isInput, setInput] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (isInput)
            inputRef.current?.focus();
    }, [isInput]);

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.patch(`${config.url}/car/get_by_id/${car.id}`, {
                model: (event.target as HTMLInputElement).value
            }).then(response => {
                    setValue(response.data.model);
                    setInput(false);
            });
        }
    }
    
    return (
        <>
        <td className={ isInput ? "table-cell-input" : "table-cell-text" } onDoubleClick={() => setInput(true)}>
            {
                (isInput) ?
                <input ref={inputRef} defaultValue={value} onKeyDown={keyPress} onBlur={() => setInput(false)}/> :
                <b> {value} </b>
            }
        </td>
        </>
    );
}

export default CarCell;
