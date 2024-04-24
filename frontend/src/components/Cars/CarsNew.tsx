import axios from "axios";
import { useEffect, useRef } from "react";
import { Car } from "./Cars";
import config from "../../config";

interface Prop {
    cars: Array<Car>;
    setCars: (data: Array<Car>) => void;
    setEnable: (data: boolean) => void;
}

function PostNew({ cars, setCars, setEnable }: Prop) {
    const InputRef = useRef<HTMLInputElement>(null);

    useEffect(() => InputRef.current?.focus(), []);

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.post(`${config.url}/car`, {
                model: (event.target as HTMLInputElement).value}
            ).then(response => {
                setCars([...cars, response.data]);
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

export default PostNew;
