import { useEffect, useState } from "react";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';

import config from "../../config";
import PostString from "./PostString";
import PostNew from "./PostNew";

export interface Post {
    id: number,
    name: string,
    is_driver: boolean,
}


function PostPage() {
    const [post, setPost] = useState<Array<Post>>();
    const [isAddPost, setAddPost] = useState(false);

    useEffect(() => {
        axios.get(`${config.url}/personal/posts`).then((response) => setPost(response.data))
    }, []);

    if (post === undefined)
        return null;

    return (
        <>
        <div className="presonal-container">
        <table id="post-table">
            <thead>
            <tr>
                <th>id</th>
                <th>Должность</th>
                <th>Квалификация</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                { post.map(value => <PostString key={value.id} post={value} posts={post} setPosts={setPost}/>) }
                { isAddPost && <PostNew posts={post} setPosts={setPost} setEnable={setAddPost}/> }
            </tbody>
        </table>
        <CSSTransition in={!isAddPost} classNames='disappear-animation' timeout={500} unmountOnExit>
            <div>
                <div id='table-footer' onClick={() => setAddPost(true)}>добавить новую должность</div>
            </div>
        </CSSTransition>
        </div>
        </>
    );
}

export default PostPage;
