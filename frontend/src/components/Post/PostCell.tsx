import axios from "axios";
import { useEffect, useRef, useState } from "react";
import config from "../../config";
import { Post } from "./Post";


function PostCell({ id, name }: Post) {
    const [value, setValue] = useState(name);
    const [isInput, setInput] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (isInput)
            inputRef.current?.focus();
    }, [isInput]);

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.patch(`${config.url}/personal/post/${id}`, null, {
                params: {name: (event.target as HTMLInputElement).value}
            }).then(response => {
                    setValue(response.data.name);
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

export default PostCell;
