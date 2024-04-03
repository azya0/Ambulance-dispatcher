import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../../config";

interface Prop {
    id: string,
    field: string,
    data: string,
}


function PersonCell({ data, id, field }: Prop) {
    const [value, setValue] = useState(data);
    const [isInput, setInput] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isInput)
            inputRef.current?.focus();
    }, [isInput])

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.patch(`${config.url}/personal/worker/${id}`, {
                [field]: (event.target as HTMLInputElement).value,
            }).then((response) => {
                setValue(response.data[field]);
                setInput(false);
            });
        }
    }

    return (
        <>
        <td className={ isInput ? "table-cell-input" : "table-cell-text" }>
            {
                (isInput) ?
                <input ref={inputRef} defaultValue={value} onKeyDown={keyPress} onBlur={() => setInput(false)}/> :
                <b onDoubleClick={() => setInput(true)}> {value} </b>
            }
        </td>
        </>
    )
}


export default PersonCell;