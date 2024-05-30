import React from 'react';
import './Post.css';

const Post = ({ post }) => {
    if (!post) {
        return <div>Loading...</div>; // or some other fallback UI
    }

    const { author, content, videoUrl, likes, comments, createdAt } = post;
    const { username } = author || {}; // Destructure author safely

    return (
        <div className="post">
            <div className="post-header">
                <h3>{username}</h3>
                <p>{new Date(createdAt).toLocaleString()}</p>
            </div>
            <div className="post-content">
                <p>{content}</p>
                {videoUrl && <video src={videoUrl} controls />}
            </div>
            <div className="post-actions">
                <button>Like ({likes.length})</button>
                <button>Comment</button>
                <button>Share</button>
            </div>
            <div className="post-comments">
                {comments.map((comment, index) => (
                    <div key={index}>
                        <strong>{comment.author.username}</strong>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Post;
