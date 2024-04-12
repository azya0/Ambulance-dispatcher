import axios from "axios";
import { useEffect, useRef } from "react";
import { Post } from "./Post";
import config from "../../config";

interface Prop {
    posts: Array<Post>;
    setPosts: (data: Array<Post>) => void;
    setEnable: (data: boolean) => void;
}

function PostNew({ posts, setPosts, setEnable }: Prop) {
    const InputRef = useRef<HTMLInputElement>(null);

    useEffect(() => InputRef.current?.focus(), []);

    const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            axios.post(`${config.url}/personal/post/`, null, {
                params: {post_name: (event.target as HTMLInputElement).value}
            }).then(response => {
                setPosts([...posts, response.data]);
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
