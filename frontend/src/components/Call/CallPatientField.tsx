import { useEffect, useRef, useState } from "react";
import config from "../../config";
import axios from "axios";

interface Prop {
    id: number,
    field_name: string,
    field_value: string | null,
    update: () => void,
}


function CallPatientField({ id, field_name, field_value, update }: Prop) {
    const [value, setValue] = useState(field_value);
    const [isChanging, setChanging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isChanging)
            inputRef.current?.focus();
    }, [isChanging]);

    if (value === undefined || isChanging === undefined)
        return null;

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.patch(`${config.url}/call/call/${id}`, { 
                patient: {
                    [field_name]: (event.target as HTMLInputElement).value
                }
            }).then((response) => {
                setValue(response.data.patient[field_name]);
                setChanging(false);
                update();
            });
        }
    }

    return (<>
        {
            isChanging ?
            <input spellCheck={false} ref={inputRef} defaultValue={value === null ? "" : value} onKeyDown={keyPress} onBlur={() => setChanging(false)}/>
            :
            <b onDoubleClick={() => setChanging(true)}>{ value }</b>
        }
    </>)
}

export default CallPatientField;
