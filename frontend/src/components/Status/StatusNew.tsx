import axios from "axios";
import { useEffect, useRef } from "react";
import { Status } from "./Status";
import config from "../../config";


interface Prop {
    statuses: Array<Status>;
    setStatuses: (data: Array<Status>) => void;
    setEnable: (data: boolean) => void;
}


function StatusNew({ statuses, setStatuses, setEnable }: Prop) {
    const InputRef = useRef<HTMLInputElement>(null);

    useEffect(() => InputRef.current?.focus(), []);

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.post(`${config.url}/call/status`, {
                name: (event.target as HTMLInputElement).value}
            ).then(response => {
                setStatuses([...statuses, response.data]);
                setEnable(false);
            });
        }
    }

    return (
        <>
        <td className="table-cell-input" colSpan={3}>
            <input ref={InputRef} onKeyDown={keyPress} onBlur={() => setEnable(false)}/>
        </td>
        </>
    );
}

export default StatusNew;
