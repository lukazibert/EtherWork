import React, { useState, useEffect } from 'react';
import axios from "axios";

interface Comment {
  body: string;
  comment_id: number;
}
interface Props {
  userId?: number;
  hashtag?: string;
}

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

const CommentList: React.FC<Props> = ({ userId = Math.floor(Math.random()*10000), hashtag = 'javascript' }) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`${CORS_PROXY}https://api.stackexchange.com/2.2/users/${userId}/comments?order=desc&sort=creation&site=stackoverflow&tagged=${hashtag}`)
            .then((response) => {
                const comments = response.data.items;
            setComments(comments);
            })
            .catch((error) => {
                console.log(error);
            });
            
        }
        fetchData();
    }, [userId, hashtag]);

    return (
        <div>
            {comments.map((comment) => (
                <div key={comment.comment_id}>
                    <p>{comment.body}</p>
                </div>
            ))}
        </div>
    );
}


export default CommentList;
