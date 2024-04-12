import axios from "axios";
import { useState } from "react";
import config from "../../config";

interface Prop {
    id: string,
    post_id: number,
    posts: Map<number, string>,
}

function PersonalPost({ id, post_id, posts }: Prop) {
    const [post, setPost] = useState(posts.get(post_id));
    const [isOpen, setOpen] = useState(false);

    const updatePost = (new_post_id: number) => {
        axios.patch(`${config.url}/personal/worker/${id}`, {post_id: new_post_id}).then(
            (response: {data: {post: {name: string}}}) => {
                setPost(response.data.post.name);
                setOpen(false);
        })
    }

    return (
        <>
        <td className="table-cell-text post-cell-text">
            {
                (isOpen) ?
                <div className="post-container">
                    <b className='cross' onClick={() => setOpen(false)}>╳</b>
                    <div>
                    {
                        Array.from(posts.keys()).map(
                            (value) => <b key={value} onClick={() => updatePost(value)}>{ posts.get(value) }</b>)
                    }
                    </div>
                </div>
                :
                <b onDoubleClick={() => setOpen(true)}>{ post }</b>
            }
            
        </td>
        </>
    )
}

export default PersonalPost;
