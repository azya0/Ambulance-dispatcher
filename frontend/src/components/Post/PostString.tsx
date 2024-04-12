import axios from "axios";
import { Post } from "./Post";
import PostCell from "./PostCell";
import config from "../../config";

interface Prop {
    post: Post,
    posts: Array<Post>,
    setPosts: (data: Array<Post>) => void,
}

function PostString({ post, posts, setPosts }: Prop) {
    return (
        <>
        <tr className="personal-string post-string">
            <td><b>{ post.id }</b></td>
            <PostCell id={post.id} name={post.name}/>
            <td onClick={() => {
                axios.delete(`${config.url}/personal/post/${post.id}`).then(() => {
                    setPosts(posts.filter((value) => value.id !== post.id));
                }).catch(error => {
                    if (error.response.status === 409)
                        alert(`Должность "${post.name}" используется!`);
                })
            }}><b>╳</b></td>
        </tr>
        </>
    );
}

export default PostString;
