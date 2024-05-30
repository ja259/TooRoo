import React from 'react';
import './Post.css';

const Post = ({ post, onLike, onComment }) => {
    return (
        <div className="post">
            <h3>{post.author.username}</h3>
            <p>{post.content}</p>
            {post.videoUrl && <video src={post.videoUrl} controls />}
            <div className="actions">
                <button onClick={() => onLike(post._id)}>Like ({post.likes.length})</button>
                <button onClick={() => {
                    const content = prompt("Enter your comment:");
                    if (content) onComment(post._id, content);
                }}>Comment</button>
            </div>
            <div className="comments">
                {post.comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <p><strong>{comment.author.username}:</strong> {comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Post;
