import axios from "axios";
import { Post } from "./Post";
import PostCell from "./PostCell";
import config from "../../config";
import { useState } from "react";

interface Prop {
    post: Post,
    posts: Array<Post>,
    setPosts: (data: Array<Post>) => void,
}

function PostString({ post, posts, setPosts }: Prop) {
    const [data, setData] = useState<Post>(post);
    
    if (data === undefined)
        return null;

    return (
        <>
        <tr className="personal-string post-string">
            <td><b>{ data.id }</b></td>
            <PostCell post={data}/>
            <td className={ (data.is_driver ? "color-green" : "") + " table-cell-text" }>
                <b className="ill" onClick={() => {
                    axios.patch(`${config.url}/personal/post/${post.id}`, {
                        is_driver: !data.is_driver,
                    }).then(response => {
                        setData(response.data);
                    });
                }}>{ data.is_driver ? "Водитель" : "Сотрудник" }</b>
            </td>
            <td onClick={() => {
                axios.delete(`${config.url}/personal/post/${data.id}`).then(() => {
                    setPosts(posts.filter((value) => value.id !== data.id));
                }).catch(error => {
                    if (error.response.status === 409)
                        alert(`Должность "${data.name}" используется!`);
                })
            }}><b>╳</b></td>
        </tr>
        </>
    );
}

export default PostString;
